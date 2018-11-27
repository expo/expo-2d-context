'use strict'
var glm = require('gl-matrix');
import Vector from './vector';

import { ShaderProgram,
  patternShaderTxt, patternShaderRepeatValues,
  radialGradShaderTxt,
  disjointRadialGradShaderTxt,
  linearGradShaderTxt,
  flatShaderTxt } from './shaders';

import { getBuiltinFonts } from './builtinFonts';

import { getEnvironment } from './environment';

const DOMException = require("domexception");

var stringFormat = require('string-format');

var parseColor = require("./cssColorParser")

var parseCssFont = require('css-font-parser');

var earcut = require('earcut');
var tess2 = require('tess2');

var bezierCubicPoints = require('adaptive-bezier-curve');
var bezierQuadraticPoints = require('adaptive-quadratic-curve');

import { StrokeExtruder } from './StrokeExtruder'

import { ImageData as _ImageData } from './utilityObjects'
export const ImageData = _ImageData;


// TODO: rather than setting vertexattribptr on every draw,
// create a separate vbo for coords vs pattern coords vs text coords
// and call once

// TODO: make sure styles don't get reapplied if they're already
// set

// TODO: use same tex coord attrib array for drawImage and fillText

function isValidCanvasImageSource(asset) {
  var environment = getEnvironment();
  if (asset === undefined) {
    return false;
  }
  if (asset instanceof Expo2DContext) {
    return true;
  }else if (asset instanceof ImageData) {
    return true;
  } else {
    if (asset.hasOwnProperty("width") &&
        asset.hasOwnProperty("height") &&
        (asset.hasOwnProperty("localUri") || asset.hasOwnProperty("data"))) {
      return true;
    }
    if (environment === "web" && "nodeName" in asset) {
      if (asset.nodeName.toLowerCase() === "img" ||
          asset.nodeName.toLowerCase() === "canvas") {
        return true;
      }
    }
  }
  return false;
}

export function cssToGlColor(cssStr) {
  try {
    return parseColor(cssStr);
  } catch (e) {
    return [];
  }
}

function outerTangent(p0, r0, p1, r1) {
  let d = Math.sqrt(
    Math.pow(p1[0]-p0[0], 2) +
    Math.pow(p1[1]-p0[1], 2)
  );
  let gamma = - Math.atan2(p1[1]-p0[1], p1[0]-p0[0]);
  let beta = Math.asin((r1-r0)/d);
  let alpha = gamma - beta;
  let angle = (Math.PI/2) - alpha;
  let tanpt1 = [
    p0[0] + r0*Math.cos(angle),
    p0[1] + r0*Math.sin(angle),
  ];
  let tanpt2 = [
    p1[0] + r1*Math.cos(angle),
    p1[1] + r1*Math.sin(angle),
  ];
  //let tanm = (c2[1] - c1[1] + Math.sin(angle)*(c2[2] - c1[2])) / (c2[0] - c1[0] + Math.cos(angle)*(c2[2] - c1[2]));
  let tanm = (tanpt2[1]-tanpt1[1])/(tanpt2[0]-tanpt1[0])
  let tanb = tanpt1[1] - tanm*tanpt1[0];

  let centerm = (p1[1]-p0[1])/(p1[0]-p0[0])
  let centerb = p0[1] - centerm*p0[0];

  let o = [0,0]

  if (!isFinite(tanm)) {
    o[0] = tanpt1[0];
    o[1] = o[0] * centerm + centerb;
  } else if (!isFinite(centerm)) {
    o[0] = p1[0];
    o[1] = o[0] * tanm + tanb;
  } else {
    o[0] = (centerb - tanb) / (tanm - centerm);
    o[1] = o[0] * tanm + tanb;
  }

  return o;
}

export class CanvasPattern {
    constructor(pattern, repeat) {
      this.pattern = pattern;
      this.repeat = repeat;
    }
}

export default class Expo2DContext {
  /**************************************************
     * Utility methods
     **************************************************/

  _initDrawingState() {
    this.drawingState = {
      "mvMatrix" : glm.mat4.create(),

      "fillStyle" : '#000000',
      "strokeStyle" : '#000000',

      "lineWidth": 1,
      "lineCap": 'butt',
      "lineJoin": 'miter',
      "miterLimit": 10,

      "strokeDashes" : [],
      "strokeDashOffset" : 0,

      // TODO: figure out directionality/font size/other css tweakability
      "font_css" : "10px sans-serif",
      "font_parsed" : null,
      "font_resources" : null,
      
      "textAlign" : "start",
      "textBaseline" : "alphabetic",

      "globalAlpha" : 1.0,

      "clippingPaths" : []
    };
    this.drawingStateStack = [];

    this._invMvMatrix = null;

    this.stencilsEnabled = false;
    this.pMatrix = glm.mat4.create();

    this.strokeExtruder = new StrokeExtruder();
    this._updateStrokeExtruderState();
    
    this.beginPath();
  }


  _updateStrokeExtruderState() {
    Object.assign(this.strokeExtruder, {
      "thickness" : this.drawingState.lineWidth,
      "cap" : this.drawingState.lineCap,
      "join" : this.drawingState.lineJoin,
      "miterLimit" : this.drawingState.miterLimit,
      "dashList" : this.drawingState.strokeDashes,
      "dashOffset" : this.drawingState.strokeDashOffset
    });
  }

  _getInvMvMatrix() {
    if (this._invMvMatrix == null) {
      this._invMvMatrix = glm.mat4.create();
      glm.mat4.invert(this._invMvMatrix, this.drawingState.mvMatrix);
    }
    return this._invMvMatrix;
  }

  _updateMatrixUniforms() {
    let gl = this.gl;

    this._invMvMatrix = null;

    if (this.activeShaderProgram != null) {
      gl.uniformMatrix4fv(
        this.activeShaderProgram.uniforms['uPMatrix'],
        false,
        this.pMatrix
      );
      gl.uniformMatrix4fv(
        this.activeShaderProgram.uniforms['uMVMatrix'],
        false,
        this.drawingState.mvMatrix
      );
      if ('uiMVMatrix' in this.activeShaderProgram.uniforms) {
        gl.uniformMatrix4fv(
          this.activeShaderProgram.uniforms['uiMVMatrix'],
          false,
          this._getInvMvMatrix()
        );
      }
      gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
    }
  }

  _updateClippingRegion() {
    let gl = this.gl;

    if (this.drawingState.clippingPaths.length == 0) {
      gl.disable(gl.STENCIL_TEST);
      this.stencilsEnabled = false;
    } else {
      if (this.stencilsEnabled == false) {
        gl.enable(gl.STENCIL_TEST);
        this.stencilsEnabled = true;
      }
      // TODO: can this be done incrementally (eg, across clip() calls)?

      gl.colorMask(false, false, false, false);
      gl.stencilMask(0xFF);
      gl.clear(gl.STENCIL_BUFFER_BIT);

      gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      // TODO: this shouldn't have to get called here:
      gl.vertexAttribPointer(
        this.activeShaderProgram.attributes['aVertexPosition'],
        2, gl.FLOAT, false, 0, 0
      );

      /// Current procedure:
      /// (TODO: clean up this comment)
      ///   - intersected buffer on bit 0
      ///   - workspace on bit 1
      ///   - clear bit 0 to all 1s
      ///   per clipping path:
      ///     - build non-0 clipping path on bit 1 with INVERT
      ///     - draw full-screen rect, stencil test EQUAL 3, set stencil value to 1 on pass and 0 on fail
      ///   - finally, set test to EQUAL 1 / KEEP
      /// if this works, i am a gl stencil witch

      for (let i = 0; i < this.drawingState.clippingPaths.length; i++) {

        gl.stencilMask(0x2);
        gl.clear(gl.STENCIL_BUFFER_BIT); // TODO: Is there any way to be more clever with the algorithm to avoid this clear?
        gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
        gl.stencilOp(gl.INVERT, gl.INVERT, gl.INVERT);

        let triangles = this.drawingState.clippingPaths[i];
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(triangles),
          gl.STATIC_DRAW
        );
        gl.drawArrays(gl.TRIANGLES, 0, triangles.length/2);


        gl.stencilMask(0x3);
        gl.stencilFunc(gl.EQUAL, 0x3, 0x3);
        gl.stencilOp(gl.ZERO, gl.KEEP, gl.KEEP);

        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            0,0, gl.drawingBufferWidth,0,  gl.drawingBufferWidth, gl.drawingBufferHeight,
            0,0, 0,gl.drawingBufferHeight,  gl.drawingBufferWidth, gl.drawingBufferHeight]),
          gl.STATIC_DRAW
        );
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      }

      // Change draw target back to framebuffer and set up stencilling

      gl.colorMask(true, true, true, true);
      gl.stencilMask(0x00);

      gl.stencilFunc(gl.EQUAL, 1, 1);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

      gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
    }

  }


  /**************************************************
   * Pixel data methods
   **************************************************/

  createImageData() {
    if (arguments.length == 1) {
      if (!(arguments[0] instanceof ImageData)) {
        throw new TypeError('Bad imagedata');
      }
      var sw = arguments[0].width;
      var sh = arguments[0].height;
    } else if (arguments.length == 2) {
      var sw = arguments[0];
      var sh = arguments[1];
      sw = Math.floor(Math.abs(sw));
      sh = Math.floor(Math.abs(sh));
    } else {
      throw new TypeError();
    }

    if (!isFinite(sw) || !isFinite(sh)) {
      throw new TypeError('Bad dimensions');
    }

    if (!(this instanceof Expo2DContext)) {
      throw new TypeError('Bad object instance')
    }

    if (sw == 0 || sh == 0) {
      throw new DOMException('Bad dimensions', 'IndexSizeError');
    }
    return new ImageData(sw, sh);
  }

  getImageData(sx, sy, sw, sh) {
    let gl = this.gl;

    if (arguments.length != 4) throw new TypeError();

    if (sw < 0) {
      sx += sw;
      sw = -sw;
    }

    if (sh < 0) {
      sy += sh;
      sh = -sh;
    }

    if (!isFinite(sx) || !isFinite(sy) ||
        !isFinite(sw) || !isFinite(sh)) {
      throw new TypeError("Bad geometry");
    }

    if (this.environment=="expo" && this.renderWithOffscreenBuffer==false) {
      console.log("WARNING: getImageData() may fail when renderWithOffscreenBuffer param is set to false")
    }

    if (this.environment=="web" && !gl.getContextAttributes()["preserveDrawingBuffer"]) {
      console.log("WARNING: getImageData() may fail when the underlying GL context's preserveDrawingBuffer attribute is not set to true") 
    }

    sx = Math.floor(sx);
    sy = Math.floor(sy);
    sw = Math.floor(sw);
    sh = Math.floor(sh);

    if (sw == 0 || sh == 0) {
      throw new DOMException('Bad geometry', 'IndexSizeError');
    }

    // This flush isn't technically necessary because readPixels should cause
    // an expo gl flush anyway, but here just in case more operations get added
    // to Expo2DContext flush in the future:
    this.flush()

    var imageDataObj = new ImageData(sw, sh);

    var rawTexData = new this._framebuffer_format.typed_array(sw * sh * 4);
    var flip_y = this._framebuffer_format.origin==="internal";
    gl.readPixels(
      sx,
      (flip_y) ? (gl.drawingBufferHeight-sh-sy) : sy,
      sw,
      sh,
      gl.RGBA,
      this._framebuffer_format.readpixels_type,
      rawTexData
    );
 
    // Undo premultiplied alpha
    // (TODO: is there any way to do this with the GPU??)
    for (let y = 0; y < imageDataObj.height; y += 1) {
      let src_base = y * imageDataObj.width * 4;
      let dst_base = (flip_y ? imageDataObj.height - y - 1: y) * imageDataObj.width * 4;
      for (let i = 0; i < imageDataObj.width * 4; i += 4) {
        let src = src_base + i;
        let dst = dst_base + i;
        imageDataObj.data[dst+0] = Math.floor((rawTexData[src+0] / rawTexData[src+3]) * 256.0);
        imageDataObj.data[dst+1] = Math.floor((rawTexData[src+1] / rawTexData[src+3]) * 256.0);
        imageDataObj.data[dst+2] = Math.floor((rawTexData[src+2] / rawTexData[src+3]) * 256.0);
        imageDataObj.data[dst+3] = Math.floor((rawTexData[src+3]/this._framebuffer_format.max_alpha)*256.0);
      }
    }

    return imageDataObj;
  }

  putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
    let gl = this.gl;

    var typeError = "";

    if (imagedata instanceof Expo2DContext) {
      // TODO: in browsers support canvas tags too
      var asset = this._assetFromContext(imagedata);
    } else if (imagedata instanceof ImageData) {
      var asset = {
        "width": imagedata.width,
        "height": imagedata.height,
        "data": new Uint8Array(imagedata.data.buffer)
      };

    } else {
      typeError = "Bad imagedata";
    }

    if (!isFinite(dx) || !isFinite(dy)) {
      typeError = "Bad dx/dy"; 
    }

    if (!isFinite(dirtyX)) {
      if (arguments.length >= 4) {
        typeError = "Bad dirtyX"; 
      }
      dirtyX = 0;
    }
    if (!isFinite(dirtyY)) {
      if (arguments.length >= 5) {
        typeError = "Bad dirtyY"; 
      }
      dirtyY = 0;
    }
    if (!isFinite(dirtyWidth)) {
      if (arguments.length >= 6) {
        typeError = "Bad dirtyWidth"; 
      }
      dirtyWidth = asset.width;
    }
    if (!isFinite(dirtyHeight)) {
      if (arguments.length >= 7) {
        typeError = "Bad dirtyHeight"; 
      }
      dirtyHeight = asset.height;
    }
    if (typeError != "") {
      throw new TypeError(typeError);
    }

    if (dirtyWidth < 0) {
      dirtyX += dirtyWidth;
      dirtyWidth = -dirtyWidth;
    }
    if (dirtyHeight < 0) {
      dirtyY += dirtyHeight;
      dirtyHeight = -dirtyHeight;
    }
    if (dirtyX < 0) {
      dirtyWidth += dirtyX;
      dirtyX = 0;
    }
    if (dirtyY < 0) {
      dirtyHeight += dirtyY;
      dirtyY = 0;
    }
    if (dirtyX + dirtyWidth > asset.width) {
      dirtyWidth = asset.width - dirtyX;
    }
    if (dirtyY + dirtyHeight > asset.height) {
      dirtyHeight = asset.height - dirtyY;
    }

    dx = Math.floor(dx);
    dy = Math.floor(dy);
    dirtyX = Math.floor(dirtyX);
    dirtyY = Math.floor(dirtyY);
    dirtyWidth = Math.floor(dirtyWidth);
    dirtyHeight = Math.floor(dirtyHeight);

    if (dirtyWidth <= 0 || dirtyHeight <= 0) {
      return;
    }

    var pattern = this.createPattern(asset, 'src-rect');
    this._applyStyle(pattern);
    if (this.activeShaderProgram == null) {
      return;
    }

    var minScreenX = dx + dirtyX;
    var minScreenY = dy + dirtyY;
    var maxScreenX = minScreenX + dirtyWidth;
    var maxScreenY = minScreenY + dirtyHeight;

    var minTexX = dirtyX / asset.width;
    var minTexY = dirtyY / asset.height;
    var maxTexX = minTexX + (dirtyWidth / asset.width);
    var maxTexY = minTexY + (dirtyHeight / asset.height);

    var vertices = [
      minScreenX, minScreenY, minTexX, minTexY,
      minScreenX, maxScreenY, minTexX, maxTexY,
      maxScreenX, minScreenY, maxTexX, minTexY,
      maxScreenX, maxScreenY, maxTexX, maxTexY
    ];

    gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      0
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aTexCoord'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      4 * 2
    );

    if (this.stencilsEnabled == true) {
      gl.disable(gl.STENCIL_TEST);
    }

    gl.uniform1f(this.activeShaderProgram.uniforms['uGlobalAlpha'], 1.0);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ZERO, gl.ONE, gl.ZERO);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);

    if (this.stencilsEnabled == true) {
      gl.enable(gl.STENCIL_TEST);
    }

    this._applyCompositingState();
  }

  /**************************************************
     * Image methods
     **************************************************/

  drawImage() {
    let gl = this.gl;

    var asset = arguments[0];

    if (typeof asset !== 'object' || asset === null ||
        !isValidCanvasImageSource(asset))
    {
      throw new TypeError('Bad asset')
    }

    if (asset.width == 0 || asset.height == 0) {
      // Zero-sized asset image causes DOMException
      throw new DOMException('Bad source rectangle', 'InvalidStateError');
    }

    var sx = 0;
    var sy = 0;
    var sw = 1;
    var sh = 1;
    if (arguments.length == 3) {
      var dx = arguments[1];
      var dy = arguments[2];
      var dw = asset.width;
      var dh = asset.height;
    } else if (arguments.length == 5) {
      var dx = arguments[1];
      var dy = arguments[2];
      var dw = arguments[3];
      var dh = arguments[4];
    } else if (arguments.length == 9) {
      sx = arguments[1] / asset.width;
      sy = arguments[2] / asset.height;
      sw = arguments[3] / asset.width;
      sh = arguments[4] / asset.height;
      var dx = arguments[5];
      var dy = arguments[6];
      var dw = arguments[7];
      var dh = arguments[8];
    } else {
      throw new TypeError();
    }

    if (!isFinite(dx) || !isFinite(dy) ||
        !isFinite(dw) || !isFinite(dh) ||
        !isFinite(sx) || !isFinite(sy) ||
        !isFinite(sw) || !isFinite(sh))
    {
      return
    }

    if (sw == 0 || sh == 0) {
      // Zero-sized source rect specified by the programmer is A-OK :P
      return
    }

    // TODO: the shader clipping method for source rectangles that are
    //  out of bounds relies on BlendFunc being set to SRC_ALPHA/SRC_ONE_MINUS_ALPHA
    //  if we can't rely on that, we'll have to clip beforehand by messing
    //  with rectangle dimensions

    var dxmin = Math.min(dx, dx + dw);
    var dxmax = Math.max(dx, dx + dw);
    var dymin = Math.min(dy, dy + dh);
    var dymax = Math.max(dy, dy + dh);

    var sxmin = Math.min(sx, sx + sw);
    var sxmax = Math.max(sx, sx + sw);
    var symin = Math.min(sy, sy + sh);
    var symax = Math.max(sy, sy + sh);

    var vertices = [
      dxmin,dymin, sxmin,symin,
      dxmin,dymax, sxmin,symax,
      dxmax,dymin, sxmax,symin,
      dxmax,dymax, sxmax,symax,
    ];

    var pattern = this.createPattern(asset, 'src-rect');
    this._applyStyle(pattern);
    if (this.activeShaderProgram == null) {
      return;
    }

    gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      0
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aTexCoord'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      4 * 2
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);
  }

  /**************************************************
   * Text methods
   **************************************************/

  _getTextAlignmentOffset (text) {
    let halign = this.drawingState.textAlign;
    if (halign == "start") {
      halign = "left";
    }
    if (halign == "end") {
      halign = "right";
    }

    let textWidth = this.measureText(text).width;

    if (halign == "right") {
      return textWidth;
    } else if (halign == "center") {
      return textWidth * 0.5;
    } else {
      return 0;
    }
  }

  _getTextBaselineOffset (text) {
    let valign = this.drawingState.textBaseline;
    let font = this.drawingState.font_resources;

    if (valign == "alphabetic") {
      return font.common.base;
    } else if (valign == "top") {
      return 0;
    } else if (valign == "bottom") {
      // TODO
    } else if (valign == "ideographic") {
      // TODO: this isn't technically correct,
      // but not sure if there is any way to 
      // actually do it with the BMFont format:
      return font.common.base;
    } else if (valign == "hanging") {
      // TODO
    }
    return 0;
  }

  _prepareText (text, x, y, xscale, geometry) {
    // TODO: directionality
    let font = this.drawingState.font_resources;

    xscale *= this.drawingState.font_parsed["size-scalar"];
    let yscale = this.drawingState.font_parsed["size-scalar"];

    let xskew = 0;
    if (this.drawingState.font_parsed["font-style"] == "italic" ||
      this.drawingState.font_parsed["font-style"] == "oblique") {
      xskew = (font.chars["M"].xadvance / 4) * xscale;  
    }

    let small_caps = this.drawingState.font_parsed["font-variant"] == "small-caps";

    text = text.replace(/\s/g, " ");

    if (font.chars[" "]) {
      var space_width = font.chars[" "].xadvance * xscale;
    } else {
      var space_width = (font.chars["M"].xadvance / 2) * xscale;
    }

    let pen_x = x;
    let pen_y = y;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        pen_x += space_width * xscale;
      }

      let glyph = font.chars[text[i]];

      let smallcap_scale = 1.0;
      if (small_caps && text[i].toLowerCase() === text[i]) {
        glyph = font.chars[text[i].toUpperCase()];
        smallcap_scale = .75;
      }

      if (!glyph) {
        continue;
        // TODO: what to actually do??
      }

      if (geometry) {
        let x1 = pen_x + glyph.xoffset * xscale * smallcap_scale;
        let y1 = pen_y + glyph.yoffset * yscale * smallcap_scale;
        let x2 = x1 + glyph.width * xscale * smallcap_scale;
        let y2 = y1 + glyph.height * yscale * smallcap_scale;

        if (small_caps) {
          let smallcap_offset = ((y2 - y1) / smallcap_scale) - (y2 - y1);
          y1 += smallcap_offset;
          y2 += smallcap_offset;
        }

        geometry.push(
          x1+xskew, y1, glyph.u1, glyph.v1, glyph.page,
          x2+xskew, y1, glyph.u2, glyph.v1, glyph.page,
          x1,       y2, glyph.u1, glyph.v2, glyph.page,

          x2+xskew, y1, glyph.u2, glyph.v1, glyph.page,
          x2,       y2, glyph.u2 ,glyph.v2, glyph.page,
          x1,       y2, glyph.u1, glyph.v2, glyph.page,
        );
      }

      pen_x += (glyph.xadvance + font.info.spacing[0]) * xscale * smallcap_scale;

      // TODO: make sure this is right:
      if (i < text.length-1) {
        if(text[i] in font.kernings && text[i+1] in font.kernings[text[i]]) {
          pen_x += font.kernings[text[i]][text[i+1]] * xscale;
        }
      }

    }

    return pen_x - x;
  } 

  measureText(text) {
    if (arguments.length != 1) throw new TypeError();
    return {"width": this._prepareText(text, 0, 0, 1)};
  }

  async initializeText() {
    if (arguments.length != 0) throw new TypeError();

    let promises = [];
    let font_objects = Object.values(this.builtinFonts);
    for (let i = 0; i < font_objects.length; i++) {
      if (font_objects[i] != null) {
        promises.push(font_objects[i].await_assets());
      }
    }
    await Promise.all(promises); 
    this.font = this.font;
  }

  _drawText(text, x, y, maxWidth, strokeWidth) {
    let gl = this.gl;
    let font = this.drawingState.font_resources;

    if (font===null) {
      throw new ReferenceError("Font system is not initialized (await initializeText())");
    }

    if (maxWidth !== undefined && !isFinite(maxWidth)) {
      return;
    }

    this._applyStyle(this.drawingState.fillStyle);
    if (this.activeShaderProgram == null) {
      return;
    }

    gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aTextPageCoord"]);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextEnabled"], 1);

    gl.uniform1f(this.activeShaderProgram.uniforms["uTextStrokeWidth"], strokeWidth);

    if (this.drawingState.font_parsed["font-weight"] === "bold") {
      gl.uniform1f(this.activeShaderProgram.uniforms["uTextDistanceFieldThreshold"], font.info.thresholds.bold);
    } else if (this.drawingState.font_parsed["font-weight"] === "bolder") {
      gl.uniform1f(this.activeShaderProgram.uniforms["uTextDistanceFieldThreshold"], font.info.thresholds.bolder);
    } else if (this.drawingState.font_parsed["font-weight"] === "lighter") {
      gl.uniform1f(this.activeShaderProgram.uniforms["uTextDistanceFieldThreshold"], font.info.thresholds.lighter);
    } else {
      gl.uniform1f(this.activeShaderProgram.uniforms["uTextDistanceFieldThreshold"], font.info.thresholds.normal);
    }


    let geometry = []
    let xscale = 1;
    if (maxWidth !== undefined) {
      let textWidth = this.measureText(text).width;
      if (textWidth > maxWidth) {
        xscale = maxWidth / textWidth;
      }
    }

    x -= this._getTextAlignmentOffset(text) * xscale;
    y -= this._getTextBaselineOffset(text);

    this._prepareText(text, x, y, xscale, geometry);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, font.textures);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      4 * 5,
      0
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aTextPageCoord'],
      3,
      gl.FLOAT,
      false,
      4 * 5,
      4 * 2, 
    );
    gl.drawArrays(gl.TRIANGLES, 0, geometry.length/5);

    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTextPageCoord"]);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextEnabled"], 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.nullTextPage);
  }

  fillText(text, x, y, maxWidth) {
    if (arguments.length != 3 && arguments.length != 4) throw new TypeError();
    this._drawText(text, x, y, maxWidth, -1);
  }

  strokeText(text, x, y, maxWidth) {
    if (arguments.length != 3 && arguments.length != 4) throw new TypeError();
    // TODO: how to actually map lineWidth to distance field thresholds??
    // TODO: scale width with mvmatrix? or does texture scaling already take care of that?
    let shaderStrokeWidth = this.drawingState.lineWidth / 7.0;
    shaderStrokeWidth /= this.drawingState.font_parsed["size-scalar"];
    this._drawText(text, x, y, maxWidth, shaderStrokeWidth);
  }

  /**************************************************
   * Rect methods
   **************************************************/

  clearRect(x, y, w, h) {
    if (arguments.length != 4) throw new TypeError();

    let gl = this.gl;

    if (!isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) {
      return;
    }

    var old_fill_style = this.drawingState.fillStyle;
    var old_global_alpha = this.drawingState.globalAlpha;

    gl.blendFunc(gl.SRC_ALPHA, gl.ZERO);
    this.drawingState.fillStyle = 'rgba(0,0,0,0)';
    this.fillRect(x, y, w, h);

    this.drawingState.fillStyle = old_fill_style;
    this.drawingState.globalAlpha = old_global_alpha;
    this._applyCompositingState()
  }

  fillRect(x, y, w, h) {
    if (arguments.length != 4) throw new TypeError();

    if (!isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) {
      return;
    }

    let gl = this.gl;

    this._applyStyle(this.drawingState.fillStyle);
    if (this.activeShaderProgram == null) {
      return;
    }

    var vertices = [
      x, y,
      x, y + h,
      x + w, y,
      x + w, y + h
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  strokeRect(x, y, w, h) {
    if (arguments.length != 4) throw new TypeError();

    if (!isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) {
      return;
    }

    let gl = this.gl;

    this._applyStyle(this.drawingState.strokeStyle);
    if (this.activeShaderProgram == null) {
      return;
    }

    let topLeft = this._getTransformedPt(x,y);
    let bottomRight = this._getTransformedPt(x+w,y+h);

    if (w==0 || h==0) {
      var oldLineCap = this.lineCap;
      this.lineCap = 'butt';
      var polyline = [
        topLeft[0], topLeft[1],
        bottomRight[0], bottomRight[1]
      ]
    } else {
      var polyline = [
        topLeft[0], topLeft[1],
        bottomRight[0], topLeft[1],
        bottomRight[0], bottomRight[1],
        topLeft[0], bottomRight[1],
      ];
    }

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    this.strokeExtruder.closed = true;
    this.strokeExtruder.mvMatrix = this.drawingState.mvMatrix;
    this.strokeExtruder.invMvMatrix = this._getInvMvMatrix();
    var vertices = this.strokeExtruder.build(polyline);

    this._drawStenciled(vertices);

    if (w==0 || h==0) {
      this.lineCap = oldLineCap;
    }
  }

  /**************************************************
     * Path methods
     **************************************************/

  beginPath() {
    if (arguments.length != 0) throw new TypeError();
    this.subpaths = [[]];
    this.subpathsModified = true;
    this.currentSubpath = this.subpaths[0];
    this.currentSubpath.closed = false;
  }

  closePath() {
    if (arguments.length != 0) throw new TypeError();
    if (this.currentSubpath.length >= 2) {
      this.currentSubpath.closed = true;
      let baseIdx = this.currentSubpath.length-2;

      // Note that this is almost moveTo() verbatim, except it doesn't
      // apply (or in this case, reapply) the transformation matrix to the
      // close point
      this.currentSubpath = [];
      this.currentSubpath.closed = false;
      this.subpathsModified = true;
      this.subpaths.push(this.currentSubpath);
      this.currentSubpath.push(this.currentSubpath[baseIdx]);
      this.currentSubpath.push(this.currentSubpath[baseIdx+1]);

    }
  }

  _pathTriangles(path) {
    if (this.subpathsModified) {
      let triangles = []

      let prunedSubpaths = []
      for (let i = 0; i < this.subpaths.length; i++) {
        let subpath = this.subpaths[i];
        if (subpath.length <= 4) {
          continue;
        }
        prunedSubpaths.push(subpath);
      }

      // TODO: be smarter about tesselator selection
      if (this.fastFillTesselation) {
        for (let i = 0; i < prunedSubpaths.length; i++) {
          let subpath = prunedSubpaths[i];
          let triangleIndices = earcut(subpath, null);
          for (let i = 0; i < triangleIndices.length; i++) {
            triangles.push(subpath[triangleIndices[i] * 2]);
            triangles.push(subpath[triangleIndices[i] * 2 + 1]);
          }
        }
      } else {
        let result = tess2.tesselate({
          contours: prunedSubpaths,
          windingRule: tess2.WINDING_NONZERO,
          elementType: tess2.POLYGONS,
          polySize: 3,
          vertexSize: 2
        });
        for (let i = 0; i < result.elements.length; i++) {
          let vertexBaseIdx = result.elements[i] * 2;
          triangles.push(result.vertices[vertexBaseIdx])
          triangles.push(result.vertices[vertexBaseIdx+1])
        }
      }

      this.subpaths.triangles = triangles;
      this.subpathsModified = false
    }

    return this.subpaths.triangles
  }

  _ensureStartPath(x, y) {
    if (this.currentSubpath.length == 0) {
      let tPt = this._getTransformedPt(x, y);
      this.currentSubpath.push(tPt[0]);
      this.currentSubpath.push(tPt[1]);
      return false;
    } else {
      return true;
    }
  }

  isPointInPath(x, y) {
    if (arguments.length != 2) throw new TypeError();

    if (!isFinite(x) || !isFinite(y)) {
      return false;
    }

    let gl = this.gl;

    let tPt = [x,y]

    // TODO: is this approach more or less efficient than some
    // other inclusion test that works on the untesselated polygon?
    // investigate....
    let triangles = this._pathTriangles(this.subpaths);
    for (let j = 0; j < triangles.length; j += 6) {
      // Point-in-triangle test adapted from:
      // https://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle/
      let v0 = [triangles[j+4]-triangles[j], triangles[j+5]-triangles[j+1]];
      let v1 = [triangles[j+2]-triangles[j], triangles[j+3]-triangles[j+1]];
      let v2 = [tPt[0]-triangles[j], tPt[1]-triangles[j+1]];

      let dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
      let dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
      let dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
      let dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
      let dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

      let invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

      let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

      if ((u >= 0) && (v >= 0) && (u + v <= 1)) {
        return true;
      }
    }

    return false;
  }

  clip() {
    if (arguments.length != 0) throw new TypeError();

    let newClipPoly = this._pathTriangles(this.subpaths);
    this.drawingState.clippingPaths.push(newClipPoly);
    this._updateClippingRegion();
  }

  fill() {
    if (arguments.length != 0) throw new TypeError();

    let gl = this.gl;

    this._applyStyle(this.drawingState.fillStyle);
    if (this.activeShaderProgram == null) {
      return;
    }

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    let triangles = this._pathTriangles(this.subpaths);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(triangles),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.drawArrays(gl.TRIANGLES, 0, triangles.length/2);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
  }

  _drawStenciled(vertices) {
    let gl = this.gl;

    if (this.stencilsEnabled == false) {
      gl.enable(gl.STENCIL_TEST);
    }

    gl.stencilMask(0x2); // Use bit 1, as bit 0 stores the clipping bounds
    gl.colorMask(false, false, false, false);
    gl.clear(gl.STENCIL_BUFFER_BIT); // Clear bit 1 to '0'

    gl.stencilFunc(gl.ALWAYS, 0xFF, 0xFF);

    gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

    this._applyStyle("black");
    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

    gl.stencilMask(0x00);
    gl.colorMask(true, true, true, true);

    gl.stencilFunc(gl.EQUAL, 3, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    this._applyStyle(this.drawingState.strokeStyle);
    if (this.activeShaderProgram == null) {
      return;
    }
    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0,0, gl.drawingBufferWidth,0,  gl.drawingBufferWidth, gl.drawingBufferHeight,
        0,0, 0,gl.drawingBufferHeight,  gl.drawingBufferWidth, gl.drawingBufferHeight]),
      gl.STATIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);


    if (this.stencilsEnabled == false) {
      gl.disable(gl.STENCIL_TEST);
    } else {
      // Set things back to normal for clipping system
      // TODO: decompose this and the same code at the bottom of _updateClippingRegion()
      gl.stencilFunc(gl.EQUAL, 1, 1);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      
    }

  }

  stroke() {
    if (arguments.length != 0) throw new TypeError();

    let vertices = [];
    for (let i = 0; i < this.subpaths.length; i++) {
      let subpath = this.subpaths[i];

      if (subpath.length == 0) {
        continue;
      }

      this.strokeExtruder.closed = subpath.closed || false;
      this.strokeExtruder.mvMatrix = this.drawingState.mvMatrix;
      this.strokeExtruder.invMvMatrix = this._getInvMvMatrix();
      vertices.push(...this.strokeExtruder.build(subpath));
    }

    // TODO: test integration with clipping
    this._drawStenciled(vertices)
  }

  moveTo(x, y) {
    if (arguments.length != 2) throw new TypeError();
    
    if (!isFinite(x) || !isFinite(y)) {
      return;
    }

    this.currentSubpath = [];
    this.currentSubpath.closed = false;
    this.subpathsModified = true;
    this.subpaths.push(this.currentSubpath);
    let tPt = this._getTransformedPt(x, y);
    this.currentSubpath.push(tPt[0]);
    this.currentSubpath.push(tPt[1]);
  }

  lineTo(x, y) {
    if (arguments.length != 2) throw new TypeError();

    if (!isFinite(x) || !isFinite(y)) {
      y.valueOf(); // Call to make 2d.path.lineTo.nonfinite.details happy
      return;
    }

    if (this._ensureStartPath(x, y) == false) {
      return;
    }

    let tPt = this._getTransformedPt(x, y);

    if (tPt[0] == this.currentSubpath[this.currentSubpath.length-2] &&
        tPt[1] == this.currentSubpath[this.currentSubpath.length-1] ) {
      return;
    }

    this.currentSubpath.push(tPt[0]);
    this.currentSubpath.push(tPt[1]);
    this.subpathsModified = true;
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    if (arguments.length != 4) throw new TypeError();

    if (!isFinite(cpx) || !isFinite(cpy) ||
        !isFinite(x) || !isFinite(y)) {
      return;
    }

    this._ensureStartPath(cpx, cpy);

    var scale = 1; // TODO: ??
    var vertsLen = this.currentSubpath.length;
    var startPt = [
      this.currentSubpath[vertsLen - 2],
      this.currentSubpath[vertsLen - 1],
    ];
    var points = bezierQuadraticPoints(
      startPt,
      this._getTransformedPt(cpx, cpy),
      this._getTransformedPt(x, y),
      scale
    );
    var lastPt = null;
    for (let i = 0; i < points.length; i++) {
      this.currentSubpath.push(points[i][0]);
      this.currentSubpath.push(points[i][1]);
    }
    this.subpathsModified = true;
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    if (arguments.length != 6) throw new TypeError();

    if (!isFinite(cp1x) || !isFinite(cp1y) ||
        !isFinite(cp2x) || !isFinite(cp2y) ||
        !isFinite(x) || !isFinite(y)) {
      return;
    }

    this._ensureStartPath(cp1x, cp1y);

    // TODO: ensure start path?
    var scale = 1; // TODO: ??
    var vertsLen = this.currentSubpath.length;
    var startPt = [
      this.currentSubpath[vertsLen - 2],
      this.currentSubpath[vertsLen - 1],
    ];
    var points = bezierCubicPoints(
      startPt,
      this._getTransformedPt(cp1x, cp1y),
      this._getTransformedPt(cp2x, cp2y),
      this._getTransformedPt(x, y),
      scale
    );
    for (let i = 0; i < points.length; i++) {
      this.currentSubpath.push(points[i][0]);
      this.currentSubpath.push(points[i][1]);
    }
    this.subpathsModified = true;
  }

  rect(x, y, w, h) {
    if (arguments.length != 4) throw new TypeError();

    if (!isFinite(x) || !isFinite(y) ||
        !isFinite(w) || !isFinite(h)) {
      return;
    }

    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.closePath();
    this.moveTo(x, y);    
  }

  arc(x, y, radius, startAngle, endAngle, counterclockwise) {
    if (arguments.length != 5 && arguments.length != 6) throw new TypeError();

    if (!isFinite(x) || !isFinite(y) ||
        !isFinite(radius) || !isFinite(startAngle) || !isFinite(endAngle)) {
      return;
    }

    if (radius < 0) {
      throw new DOMException('Bad radius', 'IndexSizeError');
    }

    if (radius == 0) {
      this.lineTo(x, y);
      return
    }

    if (startAngle == endAngle) {
      return;
    }

    counterclockwise = counterclockwise || 0;
    let centerPt = [x, y];

    if (counterclockwise) {
      let temp = startAngle;
      startAngle = endAngle;
      endAngle = temp;
    }

    if (startAngle > endAngle) {
      endAngle = (endAngle%(2*Math.PI)) +
                  Math.trunc(startAngle/(2*Math.PI))*2*Math.PI + 2*Math.PI;
    }

    if (endAngle > startAngle + 2*Math.PI) {
      endAngle = startAngle + 2*Math.PI;
    }

    // Figure out angle increment based on the radius transformed along
    // the most stretched axis, assuming anisotropy
    let xformedOrigin = this._getTransformedPt(0, 0);
    let xformedVectorAxis1 = this._getTransformedPt(radius, 0);
    let xformedVectorAxis2 = this._getTransformedPt(0, radius);
    let actualRadiusAxis1 = Math.sqrt(Math.pow(xformedVectorAxis1[0]-xformedOrigin[0],2) + Math.pow(xformedVectorAxis1[1]-xformedOrigin[1],2))
    let actualRadiusAxis2 = Math.sqrt(Math.pow(xformedVectorAxis2[0]-xformedOrigin[0],2) + Math.pow(xformedVectorAxis2[1]-xformedOrigin[1],2))
    let increment = (1/Math.max(actualRadiusAxis1, actualRadiusAxis2)) * 10.0;
    
    if (increment >= Math.abs(startAngle - endAngle)) {
      return;
    }

    let pathStartIdx = this.currentSubpath.length;

    var thetaPt = (theta) => {
      let arcPt = this._getTransformedPt(
        centerPt[0] + radius * Math.cos(theta),
        centerPt[1] + radius * Math.sin(theta)
      );
      this.currentSubpath.push(arcPt[0]);
      this.currentSubpath.push(arcPt[1]);
    }

    if (!counterclockwise) {
      var theta = startAngle;
    } else {
      var theta = endAngle;
    }

    while (true) {
      thetaPt(theta);

      if (!counterclockwise) {
        theta += increment;
        if (theta >= endAngle) {
          theta = endAngle;
          break;
        }
      } else {
        theta -= increment;
        if (theta <= startAngle) {
          theta = startAngle;
          break;
        }
      }
    }

    thetaPt(theta);

    let pathEndIdx = this.currentSubpath.length;

    this.currentSubpath._arcs = this.currentSubpath._arcs || []
    this.currentSubpath._arcs.push({
      "startIdx": pathStartIdx,
      "endIdx": pathEndIdx,
      "center": new Vector(centerPt[0], centerPt[1]),
      "radius": radius
    })

    this.subpathsModified = true;

  }

  arcTo(x1, y1, x2, y2, radius) {
    if (arguments.length != 5) throw new TypeError();

    if (!isFinite(x1) || !isFinite(y1) || 
        !isFinite(x2) || !isFinite(y2) ||
        !isFinite(radius)) {
      return;
    }

    if (radius < 0) {
      throw new DOMException('Bad radius', 'IndexSizeError');
    }

    this._ensureStartPath(x1, y1);

    this.subpathsModified = true;
   
    var s = new Vector(...this._getUntransformedPt(this.currentSubpath[this.currentSubpath.length - 2], this.currentSubpath[this.currentSubpath.length - 1]));
    var t0 = new Vector(x1,y1);
    var t1 = new Vector(x2,y2);

    // Check for colinearity
    if(s.x*(t0.y-t1.y) + t0.x*(t1.y-s.y) + t1.x*(s.y-t0.y) == 0) {
      this.lineTo(x1, y1);
      return;
    }
    
    // For further explanation of the geometry here -
    // https://math.stackexchange.com/questions/797828/calculate-center-of-circle-tangent-to-two-lines-in-space

    var s_t0 = s.subtract(t0);
    var s_t0_hat = s_t0.unit();

    var t1_t0 = t1.subtract(t0);
    var t1_t0_hat = t1_t0.unit();

    // TODO: use Vector class's angleBetween()
    var tangent_inner_angle = Math.acos(s_t0.dot(t1_t0) / (s_t0.length()*t1_t0.length()));
    // // TODO: should be possible to reduce normalizations here?
    var bisector = s_t0_hat.add(t1_t0_hat).divide(2).unit();
    var radius_scalar = radius/Math.sin(tangent_inner_angle/2);
    var center_pt = bisector.multiply(radius_scalar);

    var start_pt = s_t0_hat.multiply(center_pt.dot(s_t0_hat));
    var end_pt = t1_t0_hat.multiply(center_pt.dot(t1_t0_hat));

    // Shift center of calculations to center pt
    center_pt = center_pt.add(t0);
    start_pt = start_pt.add(t0).subtract(center_pt);
    end_pt = end_pt.add(t0).subtract(center_pt);

    var start_angle = Math.atan2(start_pt.y, start_pt.x);
    var end_angle = Math.atan2(end_pt.y, end_pt.x);

    // TODO: not sure how to choose cw/ccw here - this might require more thought
    var s_t1 = center_pt.subtract(t1);
    var t0_t1 = t0.subtract(t1);
    var clockwise = s_t1.cross(t0_t1).z <= 0
    this.arc(center_pt.x, center_pt.y, radius, start_angle, end_angle, clockwise);
  }

  /**************************************************
     * Transformation methods
     **************************************************/

  save() {
    if (arguments.length != 0) throw new TypeError();
    this.drawingStateStack.push(this.drawingState);
    this.drawingState = Object.assign({}, this.drawingState);
    this.drawingState.strokeDashes = this.drawingState.strokeDashes.slice();
    this.drawingState.clippingPaths = this.drawingState.clippingPaths.slice();
    this.drawingState.mvMatrix = glm.mat4.clone(this.drawingState.mvMatrix);

    // TODO: this will make gradients/patterns un-live, is that ok?
    this.drawingState.fillStyle = this._cloneStyle(this.drawingState.fillStyle);
    this.drawingState.strokeStyle = this._cloneStyle(this.drawingState.strokeStyle);
  }

  restore() {
    if (arguments.length != 0) throw new TypeError();
    if (this.drawingStateStack.length > 0) {
      this.drawingState = this.drawingStateStack.pop();
      this._updateMatrixUniforms();
      this._updateStrokeExtruderState();
      this._updateClippingRegion();
    }
  }

  scale(x, y) {
    if (arguments.length != 2) throw new TypeError();
    for (let argIdx = 0; argIdx < arguments.length; argIdx++) {
      if (!isFinite(arguments[argIdx])) return;
    }
    glm.mat4.scale(this.drawingState.mvMatrix, this.drawingState.mvMatrix, [x, y, 1.0]);
    this._updateMatrixUniforms();
  }

  rotate(angle) {
    if (arguments.length != 1) throw new TypeError();
    for (let argIdx = 0; argIdx < arguments.length; argIdx++) {
      if (!isFinite(arguments[argIdx])) return;
    }
    glm.mat4.rotateZ(this.drawingState.mvMatrix, this.drawingState.mvMatrix, angle);
    this._updateMatrixUniforms();
  }

  translate(x, y) {
    if (arguments.length != 2) throw new TypeError();
    for (let argIdx = 0; argIdx < arguments.length; argIdx++) {
      if (!isFinite(arguments[argIdx])) return;
    }
    glm.mat4.translate(this.drawingState.mvMatrix, this.drawingState.mvMatrix, [x, y, 0.0]);
    this._updateMatrixUniforms();
  }

  transform(a, b, c, d, e, f) {
    if (arguments.length != 6) throw new TypeError();
    for (let argIdx = 0; argIdx < arguments.length; argIdx++) {
      if (!isFinite(arguments[argIdx])) return;
    }
    glm.mat4.multiply(
      this.drawingState.mvMatrix,
      this.drawingState.mvMatrix,
      glm.mat4.fromValues(
        a, b, 0, 0,
        c, d, 0, 0,
        0, 0, 1, 0,
        e, f, 0, 1),
    );
    this._updateMatrixUniforms();
  }

  setTransform(a, b, c, d, e, f) {
    if (arguments.length != 6) throw new TypeError();
    for (let argIdx = 0; argIdx < arguments.length; argIdx++) {
      if (!isFinite(arguments[argIdx])) return;
    }
    glm.mat4.identity(this.drawingState.mvMatrix);
    this.transform(a, b, c, d, e, f);
  }

  _getTransformedPt(x, y) {
    // TODO: creating a new vec3 every time seems potentially inefficient
    var tPt = glm.vec3.fromValues(x, y, 0.0);
    glm.vec3.transformMat4(tPt, tPt, this.drawingState.mvMatrix);
    return [tPt[0], tPt[1]];
  }

  _getUntransformedPt(x, y) {
    // TODO: creating a new vec3 every time seems potentially inefficient
    var tPt = glm.vec3.fromValues(x, y, 0.0);
    glm.vec3.transformMat4(tPt, tPt, this._getInvMvMatrix());
    return [tPt[0], tPt[1]];
  }

  /**************************************************
     * Style methods
     **************************************************/

  set globalAlpha(val) {
    this.drawingState.globalAlpha = val;
  }
  get globalAlpha() {
    return this.drawingState.globalAlpha;
  }

  set shadowColor(val) {
    throw new SyntaxError('Property not supported');
  }
  get shadowColor() {
    throw new SyntaxError('Property not supported');
  }
  set shadowBlur(val) {
    throw new SyntaxError('Property not supported');
  }
  get shadowBlur() {
    throw new SyntaxError('Property not supported');
  }
  set shadowOffsetX(val) {
    throw new SyntaxError('Property not supported');
  }
  get shadowOffsetX() {
    throw new SyntaxError('Property not supported');
  }
  set shadowOffsetY(val) {
    throw new SyntaxError('Property not supported');
  }
  get shadowOffsetY() {
    throw new SyntaxError('Property not supported');
  }

  set globalCompositeOperation(val) {
    throw new SyntaxError('Property not supported');
  }
  get globalCompositeOperation() {
    throw new SyntaxError('Property not supported');
  }
  // TODO: some day, use an off-screen rendering target to support
  //       these --
  // set globalCompositeOperation(val) {
  //   let gl = this.gl;
  //   if (val == 'source-atop') {
  //   } else if (val == 'source-in') {
  //   } else if (val == 'source-out') {
  //   } else if (val == 'source-over') {
  //   } else if (val == 'destination-atop') {
  //   } else if (val == 'destination-in') {
  //   } else if (val == 'destination-out') {
  //   } else if (val == 'destination-over') {
  //   } else if (val == 'lighter') {
  //   } else if (val == 'copy') {
  //   } else if (val == 'xor') {
  //   } else {
  //     throw SyntaxError('Bad compositing mode');
  //   }
  // }

  set lineWidth(val) {
    val = Number(val)
    if (isFinite(val) && val > 0) {
      this.strokeExtruder.thickness = val;
      this.drawingState.lineWidth = val;
    }
  }
  get lineWidth() {
    return this.drawingState.lineWidth;
  }

  set lineCap(val) {
    if (this.strokeExtruder.supportedCaps.indexOf(val) >= 0) {
      this.strokeExtruder.cap = val;
      this.drawingState.lineCap = val;
    }
  }
  get lineCap() {
    return this.strokeExtruder.cap;
  }

  set lineJoin(val) {
    if (this.strokeExtruder.supportedJoins.indexOf(val) >= 0) {
      this.strokeExtruder.join = val;
      this.drawingState.lineJoin = val;
    }
  }
  get lineJoin() {
    return this.strokeExtruder.join;
  }

  set miterLimit(val) {
    val = Number(val)
    if (isFinite(val) && val > 0) {
      this.strokeExtruder.miterLimit = val;
      this.drawingState.miterLimit = val;
    }
  }
  get miterLimit() {
    return this.strokeExtruder.miterLimit;
  }

  setLineDash(segments) {
    if (arguments.length != 1) throw new TypeError();
    for (let i = 0; i < segments.length; i++) {
      if (!isFinite(segments[i]) || segments[i] < 0) {
        return;
      }
    }
    if ((segments.length % 2) == 0) {
      this.drawingState.strokeDashes = segments.slice();
    } else {
      this.drawingState.strokeDashes = segments.concat(segments);
    }
    this.strokeExtruder.dashList = this.drawingState.strokeDashes;
  }
  getLineDash() {
    if (arguments.length != 0) throw new TypeError();
    return this.drawingState.strokeDashes.slice();
  }

  set lineDashOffset(val) {
    this.drawingState.strokeDashOffset = val;
    this.strokeExtruder.dashOffset = val;
  }
  get lineDashOffset() {
    return this.drawingState.strokeDashOffset;
  }

  // TODO: only set stroke and fill when type is completely
  //       valid
  _styleSetter(val) {
    if (val === undefined || val === null) {
      return undefined;
    }
    if (typeof val === 'string' || val instanceof String) {
      if (cssToGlColor(val).length == 0) {
        return undefined;
      }
    }
    return val
  }
  _styleGetter(val) {
    let style = val
    if (typeof style === 'string' || style instanceof String) {
      let color = cssToGlColor(style);
      let alpha = color[3];
      color = color.map((v)=>v*255);
      color[3] = alpha;
      if (alpha != 1.0) {
        color = color.map((v)=>v.toString(10));
        return "rgba("+color[0]+", "+color[1]+", "+color[2]+", "+color[3]+")";
      } else {
        color = color.map((v)=>v.toString(16).padStart(2,'0'));
        return "#"+color[0]+color[1]+color[2];
      }
    }
    return val;
  }

  set strokeStyle(val) {
    val = this._styleSetter(val)
    if (val === undefined) {
      return;
    }
    this.drawingState.strokeStyle = val;
  }
  get strokeStyle() {
    return this._styleGetter(this.drawingState.strokeStyle);
  }

  set fillStyle(val) {
    val = this._styleSetter(val)
    if (val === undefined) {
      return;
    }
    this.drawingState.fillStyle = val;
  }
  get fillStyle() {
    return this._styleGetter(this.drawingState.fillStyle);
  }

  set font(val) {
    // TODO: needed to Array.from() wrap the indexof variables in parseCssFont:
    this.drawingState.font_css = val;

    let parsed_font = parseCssFont(val);

    if (!("font-size" in parsed_font)) parsed_font["font-size"] = "10px";
    if (!("font-family" in parsed_font)) parsed_font["font-family"] = ["sans-serif"];
    if (!("font-weight" in parsed_font)) parsed_font["font-weight"] = "normal";
    if (!("font-style" in parsed_font)) parsed_font["font-style"] = "normal";
    if (!("font-variant" in parsed_font)) parsed_font["font-variant"] = "normal";

    this.drawingState.font_resources = null;
    for (let i=0; i < parsed_font["font-family"].length; i++) {
      if (parsed_font["font-family"][i] in this.builtinFonts) {
        if (this.builtinFonts[parsed_font["font-family"][i]] != null) {
          this.drawingState.font_resources = this.builtinFonts[parsed_font["font-family"][i]].initialize_gl_resources(this.gl);
          break;
        }
      }
    }

    if (this.drawingState.font_resources === null) {
      throw new SyntaxError("Could not find supported font family");
    }

    // TODO: Make sure all these units are right --
    //          1em = 12pt = 16px = 100%
    let bmfont_size = this.drawingState.font_resources.info.size;
    if (parsed_font["font-size"].endsWith("em")) {
      let prop_size = parseInt(parsed_font["font-size"].substring(0,parsed_font["font-size"].length-2))
      parsed_font["size-scalar"] = (prop_size * (1/12)) / bmfont_size;
    } else if (parsed_font["font-size"].endsWith("px")) {
      let prop_size = parseInt(parsed_font["font-size"].substring(0,parsed_font["font-size"].length-2))
      parsed_font["size-scalar"] = (prop_size * 0.75) / bmfont_size;
    } else if (parsed_font["font-size"].endsWith("pt")) {  
      let prop_size = parseInt(parsed_font["font-size"].substring(0,parsed_font["font-size"].length-2))
      parsed_font["size-scalar"] = prop_size / bmfont_size;
    } else if (parsed_font["font-size"].endsWith("%")) {
      let prop_size = parseInt(parsed_font["font-size"].substring(0,parsed_font["font-size"].length-1))
      parsed_font["size-scalar"] = (prop_size * (.01/12)) / bmfont_size;
    } else {
      throw new SyntaxError("Unsupported units for font size '" + parsed_font["font-size"] + "'")
    }

    // TODO: rem?
    // sanitization of other props, etc
    this.drawingState.font_parsed = parsed_font;

  }

  get font() {
    return this.drawingState.font_css;
  }

  set textAlign(val) {
    if (["start", "end", "left", "right", "center"].includes(val)) {
      this.drawingState.textAlign = val;
    }
  }
  get textAlign() {
    return this.drawingState.textAlign;
  }

  set textBaseline(val) {
    if (["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"].includes(val)) {
      this.drawingState.textBaseline = val;
    }
  }
  get textBaseline() {
    return this.drawingState.textBaseline;
  }


  _cloneStyle(val) {
    if (typeof val === 'string') {
      return val;
    } else if (val && typeof val === 'object' && 'gradient' in val) {
      return this._cloneGradient(val);
    } else if (val && typeof val === 'object' && 'pattern' in val) {
      return  Object.assign(Object.create(Object.getPrototypeOf(val)), val)
    } else {
      throw new SyntaxError('Bad color value');
    } 
  }

  _applyStyle(val) {
    let gl = this.gl;

    if (typeof val === 'string') {
      this._setShaderProgram(this.flatShaderProgram);
      gl.uniform4fv(
        this.activeShaderProgram.uniforms['uColor'],
        cssToGlColor(val)
      );
      gl.uniform1f(
        this.activeShaderProgram.uniforms['uGlobalAlpha'],
        this.drawingState.globalAlpha
      );
    } else if (val && typeof val === 'object' && 'gradient' in val) {
      if (val.stops.length > this.maxGradStops) {
        throw new RangeError('Too many gradient stops');
      }

      let p0 = val.p0;
      let p1 = val.p1;
      let r0 = val.r0;
      let r1 = val.r1;
      let reverse_stops = false;

      let d = Math.sqrt(
        Math.pow(p1[0]-p0[0], 2) +
        Math.pow(p1[1]-p0[1], 2)
      );

      if (val.gradient === 'linear') {
        if (d <= 0.0001) {
          // Do nothing for zero-sized gradients
          return this._applyStyle("transparent");
        }
        this._setShaderProgram(this.linearGradShaderProgram);
      } else if (val.gradient === 'radial') {
        // Make sure circle 1 is always the smaller of the two
        if (r0 > r1) {
          let temp = r0;
          r0 = r1;
          r1 = temp;
          temp = p0;
          p0 = p1;
          p1 = temp;
          reverse_stops = true;
        }

        if (r0 === r1 && p0[0] === p1[0] && p0[1] === p1[1]) {
          // Perfect overlap; draw nothing
          this._setShaderProgram(null);
        } else if (r1 > d + r0) {
          // One circle circumscribes the other; use normal radial shader 
          this._setShaderProgram(this.radialGradShaderProgram);
          gl.uniform1i(this.activeShaderProgram.uniforms['uCirclesTouching'], 0);
        } else if (r1 == d + r0) {
          // Total bullshit edgecase
          this._setShaderProgram(this.radialGradShaderProgram);
          gl.uniform1i(this.activeShaderProgram.uniforms['uCirclesTouching'], 1);
        } else {
          // Circles are not compact; use disjoint shader
          this._setShaderProgram(this.disjointRadialGradShaderProgram);
          let pinchPt = [0,0];
          if (r0 !== r1) {
            pinchPt = outerTangent(p0, r0, p1, r1);
          }
          gl.uniform2fv(this.activeShaderProgram.uniforms['uPinchPt'], pinchPt);
          gl.uniform1i(this.activeShaderProgram.uniforms['uStopDirection'], reverse_stops);
        }
      } else {
        throw new SyntaxError('Bad color value');
      }

      if (this.activeShaderProgram != null) {
        gl.uniform1f(this.activeShaderProgram.uniforms['r0'], r0);
        gl.uniform1f(this.activeShaderProgram.uniforms['r1'], r1);
        gl.uniform2fv(this.activeShaderProgram.uniforms['p0'], p0);
        gl.uniform2fv(this.activeShaderProgram.uniforms['p1'], p1);
        let color_arr = [];
        let offset_arr = [];
        let stops = val.stops;
        if (reverse_stops) {
          stops = val.stops.slice().reverse();
        }
        for (let i = 0; i < stops.length; i++) {
          color_arr = color_arr.concat(stops[i][0]);
          if (reverse_stops) {
            offset_arr.push(1-stops[i][1]);
          } else {
            offset_arr.push(stops[i][1]);
          }
        }
        offset_arr.push(-1.0);

        gl.uniform4fv(
          this.activeShaderProgram.uniforms['colors[0]'],
          new Float32Array(color_arr)
        );
        gl.uniform1fv(
          this.activeShaderProgram.uniforms['offsets[0]'],
          new Float32Array(offset_arr)
        );

        gl.uniform1f(
          this.activeShaderProgram.uniforms['uGlobalAlpha'],
          this.drawingState.globalAlpha
        );
      }
    } else if (val && val instanceof CanvasPattern) {
      this._setShaderProgram(this.patternShaderProgram);

      gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);

      // TODO: cache asset textures
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        val.pattern.width,
        val.pattern.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ('data' in val.pattern) ? val.pattern.data : val.pattern // accept both assets and raw data arrays
      );
      gl.uniform2f(
        this.activeShaderProgram.uniforms['uTextureSize'],
        val.pattern.width,
        val.pattern.height
      );
      gl.uniform1i(this.activeShaderProgram.uniforms['uTexture'], 0);
      gl.uniform1i(
        this.activeShaderProgram.uniforms['uRepeatMode'],
        patternShaderRepeatValues[val.repeat]
      );

      gl.uniform1f(
        this.activeShaderProgram.uniforms['uGlobalAlpha'],
        this.drawingState.globalAlpha
      );
    } else {
      throw new SyntaxError('Bad color value');
    }

    if (this.activeShaderProgram != null) {
      gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aVertexPosition"]);
      gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTextPageCoord"]);
      gl.uniform1i(this.activeShaderProgram.uniforms["uTextEnabled"], 0);
      gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);
    }
  }

  createLinearGradient(x0, y0, x1, y1) {
    if (arguments.length != 4) throw new TypeError();
    if (!isFinite(x0) || !isFinite(y0) || !isFinite(x1) || !isFinite(y1)) {
      throw new TypeError("One or more nonfinite linear gradient parameters");
    }
    var gradObj = this._createGradient('linear');
    gradObj.p0 = [x0, y0];
    gradObj.p1 = [x1, y1];
    return gradObj;
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    if (arguments.length != 6) throw new TypeError();
    if (!isFinite(x0) || !isFinite(y0) || !isFinite(r0)||
        !isFinite(x1) || !isFinite(y1) || !isFinite(r1))
    {
      throw new TypeError("One or more nonfinite linear gradient parameters");
    }
    if (r0 < 0 || r1 < 0) {
      throw new DOMException('Bad radius', 'IndexSizeError');
    }
    var gradObj = this._createGradient('radial');
    gradObj.p0 = [x0, y0];
    gradObj.r0 = r0;
    gradObj.p1 = [x1, y1];
    gradObj.r1 = r1;
    return gradObj;
  }

  _createGradient(type) {
    var gradObj = {
      gradient: type,
      stops: [],
      addColorStop: function(offset, color) {
        if (arguments.length != 2) {
          throw new TypeError('Need to specify offset and color');
        }
        var parsedColor = cssToGlColor(color);
        if (parsedColor.length == 0) {
          throw new DOMException('Bad color value', 'SyntaxError');
        }
        if (!isFinite(offset)) {
          throw new TypeError('Non-finite gradient stop');
        }
        if (offset < 0 || offset > 1) {
          throw new DOMException('Bad stop offset', 'IndexSizeError');
        }

        // Insert the stop in the right pre-sorted position
        for (var i=0; i < this.stops.length; i++) {
          if (this.stops[i][1] == offset) {
            // Only two stops can exist at a given offset:
            //  - the first one (approaching from the "left")
            //  - the second one (approaching from the "right")
            // If we have a stop collision, check if the second
            // stop has been added yet and just overwrite that
            // one. Otherwise, insert the new from-the-right stop
            // after the from-the-left stop
            if (i < this.stops.length-1 && this.stops[i+1][1] == offset) {
              this.stops[i+1][0] = parsedColor;
              i = -1;
            } else {
              i++;
            }
            break;
          } else if (this.stops[i][1] >= offset) {
            break;
          }
        }
        if (i > -1) {
          this.stops.splice(i, 0, [parsedColor, offset]);
        }
      },
    };
    return gradObj;
  }

  _cloneGradient(val) {
      let newGrad = this._createGradient("")
      // Deep copy all the gradient properties, including various
      // type-specific coordinates and the stop list, without
      // overwriting the instance-specific object methods created
      // by _createGradient
      Object.assign(newGrad, JSON.parse(JSON.stringify(val)));
      return newGrad;
  }

  _assetFromContext(context) {
      let assetWidth = context.gl.drawingBufferWidth;
      let assetHeight = context.gl.drawingBufferHeight;
      let assetImage = context.getImageData(0, 0, assetWidth, assetHeight)
      return {
        "width": assetImage.width,
        "height": assetImage.height,
        "data":  new Uint8Array(assetImage.data.buffer),
      }
  }

  createPattern(asset, repeat) {
    if (arguments.length != 2) throw new TypeError();
    // TODO: make sure this doesn't pick up asset changes later on
    
    if (repeat !== undefined && (!repeat || repeat === '')) {
      repeat = 'repeat';
    } else if (!(repeat in patternShaderRepeatValues)) {
      throw new DOMException('Bad repeat value', 'SyntaxError');
    }
    if (asset instanceof Expo2DContext) {
      asset = this._assetFromContext(asset);
    } else if (!isValidCanvasImageSource(asset)) { 
      throw new TypeError("Bad asset");
    }
    return new CanvasPattern(asset, repeat)
  }

  _setShaderProgram(shaderProgram) {
    let gl = this.gl;
    if (this.activeShaderProgram != shaderProgram) {
      if (shaderProgram !== null) {
        shaderProgram.bind();
      } else {
        gl.useProgram(null);
        gl.bindVertexArray(null);
      }
      this.activeShaderProgram = shaderProgram;
      this._updateMatrixUniforms();
    }
  }

  _applyCompositingState() {
    // TODO: actually set things up based on the compositing operation,
    //       later
    let gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  _drawOffscreenBuffer() {
    let gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (this.stencilsEnabled == true) {
      gl.disable(gl.STENCIL_TEST);
    }

    this._setShaderProgram(this.patternShaderProgram);
    gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);

    gl.uniform2f(
      this.activeShaderProgram.uniforms['uTextureSize'],
      gl.drawingBufferWidth,
      gl.drawingBufferHeight
    );
    gl.uniform1i(this.activeShaderProgram.uniforms['uTexture'], 0);
    gl.uniform1i(this.activeShaderProgram.uniforms['uRepeatMode'], 4);

    gl.uniform1f(this.activeShaderProgram.uniforms['uGlobalAlpha'], 1);

    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTextPageCoord"]);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextEnabled"], 0);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1); // TODO: causing trips in web-land

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferTexture);

    var vertices = [
      0,0, 0,1,
      0,gl.drawingBufferHeight, 0,0,
      gl.drawingBufferWidth,0, 1,1,
      gl.drawingBufferWidth,gl.drawingBufferHeight, 1,0,
    ];


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aVertexPosition'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      0
    );
    gl.vertexAttribPointer(
      this.activeShaderProgram.attributes['aTexCoord'],
      2,
      gl.FLOAT,
      false,
      4 * 2 * 2,
      4 * 2
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTexCoord"]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);

    if (this.stencilsEnabled == true) {
      gl.enable(gl.STENCIL_TEST);
    }
  }

  _initOffscreenBuffer() {
    // TODO: this is to work around gl.readPixels not working on the ios default
    // framebuffer - remove once that's fixed
    let gl = this.gl;
    let buffer_format = {
      origin: "texture",
      internal_format: null,
      type: null,
      max_alpha: null
    }

    this.framebuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    this.framebuffer.width = gl.drawingBufferWidth;
    this.framebuffer.height = gl.drawingBufferHeight;

    this.framebufferTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // ******* IMPORTANT **********
    // The framebuffer (whether built-in or to-texture) _has_ to be greater
    // than 8B/channel precision in order for putImageData(getImageData(...)) 
    // to work.
    //
    // We're using HALF_FLOAT/16F for the moment because of iOS limitations:
    // https://github.com/pex-gl/pex-glu/issues/3
    //
    // TODO: maybe instead of choosing texture formats based on environement,
    //       have an ordered list of good-to-bad ones and try them in a loop,
    //       falling back as necessary? and log appropriately
    if (this.environment === "web") {
      let ext = gl.getExtension("EXT_color_buffer_float");
      if (!ext) {
        console.log("WARNING: Could not get float framebuffer, getImageData() may be lossy")
        buffer_format.internal_format = gl.RGBA
        buffer_format.type = gl.UNSIGNED_BYTE
        buffer_format.typed_array = Uint8Array
        buffer_format.max_alpha = 256.0;
      } else {
        buffer_format.internal_format = gl.RGBA32F
        buffer_format.type = gl.FLOAT
        buffer_format.readpixels_type = gl.FLOAT
        buffer_format.typed_array = Float32Array
        buffer_format.max_alpha = 1.0;
      }
    } else {
      buffer_format.internal_format = gl.RGBA16F
      buffer_format.type = gl.HALF_FLOAT 
      buffer_format.readpixels_type = gl.FLOAT 
      buffer_format.typed_array = Float32Array
      buffer_format.max_alpha = 1.0;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, buffer_format.internal_format,
                  this.framebuffer.width, this.framebuffer.height,
                  0, gl.RGBA, buffer_format.type, null);


    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.framebufferTexture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8,
                           this.framebuffer.width, this.framebuffer.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return buffer_format
  }

  /**************************************************
   * Main
   **************************************************/
  get width(){
    return this.gl.drawingBufferWidth;
  }
  set width(val){
    console.log("WARNING: setting context width/height at runtime is not supported");
  }

  get height(){
    return this.gl.drawingBufferHeight;
  }
  set height(val){
    console.log("WARNING: setting context width/height at runtime is not supported");
  }


  constructor(gl, options) {
    // Paramters
    // TODO: how do we make these parameters more parameterizable
    //       (that is, settable at creation fixed afterwards) ?
    options = options || {};
    this.maxGradStops = options.maxGradStops || 128;
    this.renderWithOffscreenBuffer = options.renderWithOffscreenBuffer || false;
    this.fastFillTesselation = options.fastFillTesselation || false;

    this.environment = getEnvironment();

    this.builtinFonts = getBuiltinFonts();

    // Initialization
    this.gl = gl;
    this.activeShaderProgram = null;

    this.vertexBuffer = gl.createBuffer();

    // TODO: Put these into a generator function in shaders.js and
    // put all shader params (right now, just gradient stops) as function
    // arguments
    this.flatShaderProgram = new ShaderProgram(
      gl,
      flatShaderTxt['vert'],
      flatShaderTxt['frag']
    );

    this.linearGradShaderProgram = new ShaderProgram(
      gl,
      linearGradShaderTxt['vert'],
      stringFormat(linearGradShaderTxt['frag'], {
        maxGradStops: this.maxGradStops,
      })
    );

    this.radialGradShaderProgram = new ShaderProgram(
      gl,
      radialGradShaderTxt['vert'],
      stringFormat(radialGradShaderTxt['frag'], {
        maxGradStops: this.maxGradStops,
      })
    );

    this.disjointRadialGradShaderProgram = new ShaderProgram(
      gl,
      disjointRadialGradShaderTxt['vert'],
      stringFormat(disjointRadialGradShaderTxt['frag'], {
        maxGradStops: this.maxGradStops,
      })
    );

    this.patternShaderProgram = new ShaderProgram(
      gl,
      patternShaderTxt['vert'],
      patternShaderTxt['frag']
    );

    this._initDrawingState();

    if (this.renderWithOffscreenBuffer) {
      this._framebuffer_format = this._initOffscreenBuffer();
      // top and bottom are swapped while drawOffscreenBuffer() is in use
      glm.mat4.ortho(
        this.pMatrix,
        0, gl.drawingBufferWidth,
        0, gl.drawingBufferHeight,
        -1, 1
      );
    } else {
      this._framebuffer_format = {
        origin: "internal",
        internal_format: gl.RGBA,
        typed_array: Uint8Array,
        type: gl.UNSIGNED_BYTE,
        readpixels_type: gl.UNSIGNED_BYTE,
        max_alpha: 256.0
      }
      glm.mat4.ortho(
        this.pMatrix,
        0, gl.drawingBufferWidth,
        gl.drawingBufferHeight, 0,
        -1, 1
      );
    }

    this._setShaderProgram(this.flatShaderProgram);

    this._applyCompositingState();

    this.nullTextPage = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.nullTextPage);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY,
      1,
      gl.RGBA8,
      1,//w
      1,//h
      1
    );
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      0,
      0,
      0,
      1,//w
      1,//h
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0,0,0,0])
    );

    gl.clearColor(0, 0, 0, 0.0);
    gl.clearStencil(1);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    glm.mat4.identity(this.drawingState.mvMatrix);
    this._updateMatrixUniforms();

    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT |
      this.gl.DEPTH_BUFFER_BIT |
      this.gl.STENCIL_BUFFER_BIT
    );

    if (!(gl.getParameter(gl.STENCIL_BITS)>=2)) {
      console.log("WARNING: Was given " + gl.getParameter(gl.STENCIL_BITS) + " stencil bits - strokes and clipping will be broken");
    }

  }

  flush() {
    if (this.renderWithOffscreenBuffer) {
      this._drawOffscreenBuffer();
    }
    if (this.environment === "expo") {
      this.gl.endFrameEXP();
    }
  }
}

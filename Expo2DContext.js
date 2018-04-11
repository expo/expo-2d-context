import * as glm from 'gl-matrix';

import { ShaderProgram,
  patternShaderTxt, patternShaderRepeatValues,
  radialGradShaderTxt,
  disjointRadialGradShaderTxt,
  linearGradShaderTxt,
  flatShaderTxt } from './shaders';

// Built-in fonts:
import { calibri } from './calibri';
import { timesnewroman } from './timesnewroman';
import { couriernew } from './couriernew';

const DOMException = require("domexception");

var stringFormat = require('string-format');

var parseColor = require('color-parser');
var parseCssFont = require('css-font-parser');

var earcut = require('earcut');
var bezierCubicPoints = require('adaptive-bezier-curve');
var bezierQuadraticPoints = require('adaptive-quadratic-curve');

var extrudePolyline = require('extrude-polyline');

// TODO: rather than setting vertexattribptr on every draw,
// create a separate vbo for coords vs pattern coords vs text coords
// and call once

// TODO: make sure styles don't get reapplied if they're already
// set

// TODO: use same tex coord attrib array for drawImage and fillText

function cssToGlColor(cssStr) {
  parsedColor = parseColor(cssStr);
  if (!parsedColor) {
    throw new SyntaxError('Bad color value');
  }
  if (!('a' in parsedColor)) {
    parsedColor['a'] = 1.0;
  }
  return [
    parsedColor['r'] / 255,
    parsedColor['g'] / 255,
    parsedColor['b'] / 255,
    parsedColor['a'],
  ];
}

function circleMod(rad) {
  if (rad < 0.0) {
    // TODO: what if it's, like, *very* negative?
    rad += 2 * Math.PI;
  }
  rad %= 2 * Math.PI;
  return rad;
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


export default class Expo2DContext {
  /**************************************************
     * Utility methods
     **************************************************/

  initDrawingState() {
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

    this.stencilsEnabled = false;
    this.pMatrix = glm.mat4.create();

    this.strokeExtruder = extrudePolyline();
    this._updateStrokeExtruderState();
    
    this.beginPath();
  }


  _updateStrokeExtruderState() {
    // TODO: joins currently aren't placed at the beginning/end of
    // closed paths
    Object.assign(this.strokeExtruder, {
      "thickness" : this.drawingState.lineWidth,
      "cap" : this.drawingState.lineCap,
      "join" : this.drawingState.lineJoin,
      "miterLimit" : this.drawingState.miterLimit,
      "closed" : true
    });
  }

  _updateMatrixUniforms() {
    let gl = this.gl;

    let invMvMatrix = glm.mat4.create();
    glm.mat4.invert(invMvMatrix, this.drawingState.mvMatrix);

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
        invMvMatrix
      );
    }
    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
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

      for (i = 0; i < this.drawingState.clippingPaths.length; i++) {

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
        gl.drawArrays(gl.TRIANGLES, 0, triangles.length/2);

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
      let oldData = arguments[0];
      return {
        width: oldData.width,
        height: oldData.height,
        data: new Uint8Array(oldData.data),
      };
    } else if (arguments.length == 2) {
      let sw = arguments[0];
      let sh = arguments[1];
      return {
        width: sw,
        height: sh,
        data: new Uint8Array(sw * sh * 4),
      };
    } else {
      throw new SyntaxError('Bad function signature');
    }
  }

  getImageData(sx, sy, sw, sh) {
    let gl = this.gl;

    var imageDataObj = {
      width: sw,
      height: sh,
      data: new Uint8Array(sw * sh * 4),
    };
    
    gl.readPixels(
      sx,
      sy,
      sw,
      sh,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imageDataObj.data
    );

    return imageDataObj;
  }

  putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
    let gl = this.gl;

    if (!dirtyX) {
      dirtyX = 0;
    }
    if (!dirtyY) {
      dirtyY = 0;
    }
    if (!dirtyWidth) {
      dirtyWidth = imagedata.width;
    }
    if (!dirtyHeight) {
      dirtyHeight = imagedata.height;
    }
    if (dirtyWidth < 0) {
      dx += dirtyWidth;
      dirtyWidth = -dirtyWidth;
    }
    if (dirtyHeight < 0) {
      dx += dirtyHeight;
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
    if (dirtyX + dirtyWidth > imagedata.width) {
      dirtyWidth = imagedata.width - dirtyX;
    }
    if (dirtyY + dirtyHeight > imagedata.height) {
      dirtyHeight = imagedata.height - dirtyY;
    }
    if (dirtyWidth <= 0 || dirtyHeight <= 0) {
      return;
    }

    // TODO: dirty slicing the data array

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
      dirtyWidth,
      dirtyHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      imagedata.data
    );

    // TODO: figure out how to set these all correctly
    gl.uniform2f(
      this.activeShaderProgram.uniforms['uTextureSize'],
      dirtyWidth,
      val.pattern.height
    );
    gl.uniform1i(this.activeShaderProgram.uniforms['uTexture'], 0);
    gl.uniform1i(
      this.activeShaderProgram.uniforms['uRepeatMode'],
      patternShaderRepeatValues['src-rect']
    );

    // TODO: set blend mode to replace
    gl.uniform1f(this.activeShaderProgram.uniforms['uGlobalAlpha'], 1.0);

    gl.deleteTexture(texture);
  }

  /**************************************************
     * Image methods
     **************************************************/

  drawImage() {
    let gl = this.gl;

    var asset = arguments[0];

    if (typeof asset !== 'object' ||
        asset === null ||
        !("localUri" in asset && "width" in asset && "height" in asset))
    {
      throw new TypeError('Bad asset')
    }

    if (asset.width == 0 || asset.height == 0) {
      // Zero-sized asset image causes DOMException
      throw new DOMException('Bad source rectangle', 'IndexSizeError');
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
      throw new SyntaxError('Bad function signature');
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

    for (i = 0; i < text.length; i++) {
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
    return {"width": this._prepareText(text, 0, 0, 1)};
  }

  async initializeText() {
    await Promise.all([
      calibri.await_assets(),
      timesnewroman.await_assets(),
      couriernew.await_assets()
    ]);
    this.font = this.font;
  }

  _drawText(text, x, y, maxWidth, strokeWidth) {
    let gl = this.gl;
    let font = this.drawingState.font_resources;

    if (font===null) {
      throw new ReferenceError("Font system is not initialized (await initializeText())");
    }

    this._applyStyle(this.drawingState.fillStyle);

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

    // TODO: multiple pages:
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, font.textures);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);

    // TODO: debug code, delete:
    // const texture = gl.createTexture();
    // gl.activeTexture(gl.TEXTURE1);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texImage2D(
    //   gl.TEXTURE_2D,
    //   0,
    //   gl.RGBA,
    //   x.width,
    //   x.height,
    //   0,
    //   gl.RGBA,
    //   gl.UNSIGNED_BYTE,
    //   x
    // );

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
  }

  fillText(text, x, y, maxWidth) {
    this._drawText(text, x, y, maxWidth, -1);
  }

  strokeText(text, x, y, maxWidth) {
    // TODO: how to actually map lineWidth to distance field thresholds??
    let shaderStrokeWidth = this.drawingState.lineWidth / 7.0;
    shaderStrokeWidth /= this.drawingState.font_parsed["size-scalar"];
    this._drawText(text, x, y, maxWidth, shaderStrokeWidth);
  }

  /**************************************************
   * Rect methods
   **************************************************/

  clearRect(x, y, w, h) {
    let gl = this.gl;

    if (
      x <= 0.0 &&
      y <= 0.0 &&
      x + w >= gl.drawingBufferWidth &&
      y + h >= gl.drawingBufferHeight
    ) {
      this.gl.clear(
        this.gl.COLOR_BUFFER_BIT |
          this.gl.DEPTH_BUFFER_BIT
      );
    } else {
      var old_fill_style = this.drawingState.fillStyle;

      gl.blendFunc(gl.SRC_ALPHA, gl.ZERO);
      this.drawingState.fillStyle = 'rgba(0,0,0,0);';

      this.fillRect(x, y, w, h);

      this.drawingState.fillStyle = old_fill_style;
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  fillRect(x, y, w, h) {
    let gl = this.gl;

    this._applyStyle(this.drawingState.fillStyle);

    var vertices = [x, y, x, y + h, x + w, y, x + w, y + h];

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
    let gl = this.gl;

    this._applyStyle(this.drawingState.strokeStyle);

    var polyline = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

    var mesh = this.strokeExtruder.build(polyline);

    var vertices = [];
    for (i = 0; i < mesh.cells.length; i++) {
      vertices.push(mesh.positions[mesh.cells[i][0]][0]);
      vertices.push(mesh.positions[mesh.cells[i][0]][1]);
      vertices.push(mesh.positions[mesh.cells[i][1]][0]);
      vertices.push(mesh.positions[mesh.cells[i][1]][1]);
      vertices.push(mesh.positions[mesh.cells[i][2]][0]);
      vertices.push(mesh.positions[mesh.cells[i][2]][1]);
    }

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

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
  }

  /**************************************************
     * Path methods
     **************************************************/

  beginPath() {
    this.subpaths = [[]];
    this.currentSubpath = this.subpaths[0];
  }

  closePath() {
    if (this.currentSubpath.length > 0) {
      this.currentSubpath.push(this.currentSubpath[0]);
      this.currentSubpath.push(this.currentSubpath[1]);
      delete this.currentSubpath.triangles;
      this.currentSubpath = [];
      this.subpaths.push(this.currentSubpath);
    }
  }

  _subpathTriangles(subpath) {
      if (!("triangles" in subpath)) {
        let triangleIndices = earcut(subpath, null);
        subpath.triangles = [];

        for (j = 0; j < triangleIndices.length; j++) {
          subpath.triangles.push(subpath[triangleIndices[j] * 2]);
          subpath.triangles.push(subpath[triangleIndices[j] * 2 + 1]);
        }
      }
      return subpath.triangles;
  }

  isPointInPath(x, y) {
    // TODO: TEST THIS OUT!!!
    let gl = this.gl;

    let tPt = this._getTransformedPt(x, y);

    for (i = 0; i < this.subpaths.length; i++) {
      let subpath = this.subpaths[i];

      if (subpath.length == 0) {
        continue;
      }

      // TODO: is this approach more or less efficient than some
      // other inclusion test that works on the untesselated polygon?
      // investigate....
      let triangles = this._subpathTriangles(subpath);
      for (j = 0; j < triangles.length; j += 6) {
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

        if ((u >= 0) && (v >= 0) && (u + v < 1)) {
          return true;
        }
      }
    }

    return false;
  }

  clip() {
    let newClipPoly = [];
    
    for (i = 0; i < this.subpaths.length; i++) {
      let subpath = this.subpaths[i];
      if (subpath.length == 0) {
        continue;
      }
      let triangles = this._subpathTriangles(subpath).slice();
      newClipPoly = newClipPoly.concat(triangles);
    }
    this.drawingState.clippingPaths.push(newClipPoly);
    this._updateClippingRegion();
  }

  fill() {
    let gl = this.gl;

    this._applyStyle(this.drawingState.fillStyle);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    for (i = 0; i < this.subpaths.length; i++) {
      let subpath = this.subpaths[i];

      if (subpath.length == 0) {
        continue;
      }

      let triangles = this._subpathTriangles(subpath);

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
    }

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
  }

  stroke() {
    let gl = this.gl;

    this._applyStyle(this.drawingState.strokeStyle);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    for (i = 0; i < this.subpaths.length; i++) {
      let subpath = this.subpaths[i];

      if (subpath.length == 0) {
        continue;
      }

      // TODO: we're going to have to branch the polyline extruder
      // anyway, so make it natively take our subpath format instead
      // of having to do this ):

      // TODO: fix polyline extruder so it doesn't choke when we have
      // the same vertex twice (probably just consists of moving this
      // dedup check into the extruder code)
      let polyline = [];
      let lastPt = null;
      let pt = null;
      for (j = 0; j < subpath.length; j += 2) {
        lastPt = pt;
        pt = [subpath[j], subpath[j + 1]];
        if (lastPt && lastPt[0] == pt[0] && lastPt[1] == pt[1]) continue;
        polyline.push([subpath[j], subpath[j + 1]]);
      }
      let mesh = this.strokeExtruder.build(polyline);

      let vertices = [];
      for (i = 0; i < mesh.cells.length; i++) {
        vertices.push(mesh.positions[mesh.cells[i][0]][0]);
        vertices.push(mesh.positions[mesh.cells[i][0]][1]);
        vertices.push(mesh.positions[mesh.cells[i][1]][0]);
        vertices.push(mesh.positions[mesh.cells[i][1]][1]);
        vertices.push(mesh.positions[mesh.cells[i][2]][0]);
        vertices.push(mesh.positions[mesh.cells[i][2]][1]);
      }

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
    }

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);
  }

  moveTo(x, y) {
    this.currentSubpath = [];
    this.subpaths.push(this.currentSubpath);
    let tPt = this._getTransformedPt(x, y);
    this.currentSubpath.push(tPt[0]);
    this.currentSubpath.push(tPt[1]);
  }

  lineTo(x, y) {
    // TODO: ensure start path?
    let tPt = this._getTransformedPt(x, y);
    this.currentSubpath.push(tPt[0]);
    this.currentSubpath.push(tPt[1]);
    delete this.currentSubpath.triangles;
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    // TODO: ensure start path?
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
    for (i = 0; i < points.length; i++) {
      this.currentSubpath.push(points[i][0]);
      this.currentSubpath.push(points[i][1]);
    }
    delete this.currentSubpath.triangles;
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
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
    for (i = 0; i < points.length; i++) {
      this.currentSubpath.push(points[i][0]);
      this.currentSubpath.push(points[i][1]);
    }
    delete this.currentSubpath.triangles;
  }

  rect(x, y, w, h) {
    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.closePath();
  }

  arc(x, y, radius, startAngle, endAngle, counterclockwise) {
    // TODO: bounds check for radius?
    counterclockwise = counterclockwise || 0;
    centerPt = [x, y];

    // TODO: increment shouldn't be constant when arc has been scaled
    // to be non-circular
    let increment = Math.PI / 2;
    while (true) {
      let pt1 = this._getTransformedPt(radius, 0);
      let pt2 = this._getTransformedPt(
        radius * Math.cos(increment),
        radius * Math.sin(increment)
      );

      let accurate_midpt = this._getTransformedPt(
        radius * Math.cos(increment / 2),
        radius * Math.sin(increment / 2)
      );
      let actual_midpt = [
        pt1[0] + (pt2[0] - pt1[0]) / 2,
        pt1[1] + (pt2[1] - pt1[1]) / 2,
      ];
      let error = Math.sqrt(
        Math.pow(actual_midpt[0] - accurate_midpt[0], 2) +
          Math.pow(actual_midpt[1] - accurate_midpt[1], 2)
      );
      if (error > 0.5) {
        increment /= 2;
      } else {
        break;
      }
    }

    startAngle = circleMod(startAngle);
    endAngle = circleMod(endAngle);

    if (counterclockwise) {
      temp = startAngle;
      startAngle = endAngle;
      endAngle = temp;

    }

    let theta = startAngle;
    while (true) {
      let arcPt = this._getTransformedPt(
        centerPt[0] + radius * Math.cos(theta),
        centerPt[1] + radius * Math.sin(theta)
      );
      this.currentSubpath.push(arcPt[0]);
      this.currentSubpath.push(arcPt[1]);

      old_theta = theta;
      theta += increment;
      theta = circleMod(theta);
      if (theta < old_theta) {
        old_theta -= 2 * Math.PI;
      }
      if (old_theta < endAngle && theta >= endAngle) {
        break;
      }
    }

    let arcPt = this._getTransformedPt(
      centerPt[0] + radius * Math.cos(endAngle),
      centerPt[1] + radius * Math.sin(endAngle)
    );
    this.currentSubpath.push(arcPt[0]);
    this.currentSubpath.push(arcPt[1]);

    delete this.currentSubpath.triangles;
  }

  arcTo(x1, y1, x2, y2, radius) {
    // TODO
    delete this.currentSubpath.triangles;
    throw new SyntaxError('Method not supported');
  }

  /**************************************************
     * Transformation methods
     **************************************************/

  save() {
    this.drawingStateStack.push(this.drawingState);
    this.drawingState = Object.assign({}, this.drawingState);
    this.drawingState.strokeDashes = this.drawingState.strokeDashes.slice();
    this.drawingState.clippingPaths = this.drawingState.clippingPaths.slice();
    this.drawingState.mvMatrix = glm.mat4.clone(this.drawingState.mvMatrix);
    this.drawingState.fillStyle = this._cloneStyle(this.drawingState.fillStyle);
    this.drawingState.strokeStyle = this._cloneStyle(this.drawingState.strokeStyle);
  }

  restore() {
    this.drawingState = this.drawingStateStack.pop();
    this._updateMatrixUniforms(); // TODO: batch this somehow
    this._updateStrokeExtruderState();
    this._updateClippingRegion();
  }

  scale(x, y) {
    glm.mat4.scale(this.drawingState.mvMatrix, this.drawingState.mvMatrix, [x, y, 1.0]);
    this._updateMatrixUniforms(); // TODO: batch this somehow
  }

  rotate(angle) {
    glm.mat4.rotateZ(this.drawingState.mvMatrix, this.drawingState.mvMatrix, angle);
    this._updateMatrixUniforms(); // TODO: batch this somehow
  }

  translate(x, y) {
    glm.mat4.translate(this.drawingState.mvMatrix, this.drawingState.mvMatrix, [x, y, 0.0]);
    this._updateMatrixUniforms(); // TODO: batch this somehow
  }

  transform(a, b, c, d, e, f) {
    glm.mat4.multiply(
      this.drawingState.mvMatrix,
      this.drawingState.mvMatrix,
      glm.mat4.fromValues(
        a, b, 0, 0,
        c, d, 0, 0,
        0, 0, 1, 0,
        e, f, 0, 1),
    );
    this._updateMatrixUniforms(); // TODO: batch this somehow
  }

  setTransform(a, b, c, d, e, f) {
    glm.mat4.identity(this.drawingState.mvMatrix);
    this.transform(a, b, c, d, e, f);
  }

  _getTransformedPt(x, y) {
    // TODO: creating a new vec3 every time seems potentially inefficient
    var tPt = glm.vec3.create();
    glm.vec3.set(tPt, x, y, 0.0);
    glm.vec3.transformMat4(tPt, tPt, this.drawingState.mvMatrix);
    return [tPt[0], tPt[1]];
  }

  /**************************************************
     * Style methods
     **************************************************/

  set globalAlpha(val) {
    this.drawingState.globalAlpha = val;
    this.gl.uniform1f(
      this.activeShaderProgram.uniforms['uGlobalAlpha'],
      this.drawingState.globalAlpha
    );
  }
  get globalAlpha() {
    return this.drawingState.globalAlpha;
  }

  // TODO: this compositing code is eons away from primetime,
  // so it seems like a good idea to just have references to the
  // property fail
  set globalCompositeOperation(val) {
    throw new SyntaxError('Property not supported');
  }
  get globalCompositeOperation() {
    throw new SyntaxError('Property not supported');
  }
  // set globalCompositeOperation(val) {
  //   let gl = this.gl;
  //   if (val == 'source-atop') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'source-in') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'source-out') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'source-over') {
  //     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //   } else if (val == 'destination-atop') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'destination-in') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'destination-out') {
  //     //gl.blendFunc(,);
  //   } else if (val == 'destination-over') {
  //     gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA);
  //   } else if (val == 'lighter') {
  //     gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
  //   } else if (val == 'copy') {
  //     // TODO: it seems like the *whole* buffer is
  //     // supposed to be cleared beforehand with this?
  //     // weeeeeirrrddd
  //     gl.blendFunc(gl.ONE, gl.ZERO);
  //   } else if (val == 'xor') {
  //     //gl.blendFunc(,);
  //   } else {
  //     throw SyntaxError('Bad compositing mode');
  //   }
  // }

  set lineWidth(val) {
    this.strokeExtruder.thickness = val;
    this.drawingState.lineWidth = val;
  }
  get lineWidth() {
    return this.strokeExtruder.thickness;
  }

  set lineCap(val) {
    this.strokeExtruder.cap = val;
    this.drawingState.lineCap = val;
  }
  get lineCap() {
    return this.strokeExtruder.cap;
  }

  set lineJoin(val) {
    this.strokeExtruder.join = val;
    this.drawingState.lineJoin = val;
  }
  get lineJoin() {
    return this.strokeExtruder.join;
  }

  set miterLimit(val) {
    this.strokeExtruder.miterLimit = val;
    this.drawingState.miterLimit = val;
  }
  get miterLimit() {
    return this.strokeExtruder.miterLimit;
  }

  setLineDash(segments) {
    // TODO: sanitization
    this.drawingState.strokeDashes = segments.slice();
  }
  getLineDash() {
    return this.drawingState.strokeDashes.slice();
  }

  set lineDashOffset(val) {
    this.drawingState.strokeDashOffset = val;
  }
  get lineDashOffset() {
    return this.drawingState.strokeDashOffset;
  }

  set strokeStyle(val) {
    this.drawingState.strokeStyle = this._cloneStyle(val);
  }
  get strokeStyle() {
    return this._cloneStyle(this.drawingState.strokeStyle);
  }

  set fillStyle(val) {
    this.drawingState.fillStyle = this._cloneStyle(val);
  }
  get fillStyle() {
    return this._cloneStyle(this.drawingState.fillStyle);
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

    font_resources = null;
    for (i=0; i < parsed_font["font-family"].length; i++) {
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
      return Object.assign({}, val);
    } else {
      throw new SyntaxError('Bad color value');
    } 
  }

  _applyStyle(val) {
    let gl = this.gl;

    // TODO: should style errors be ignored? raised immediately?

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

      if (val.gradient === 'linear') {
        this._setShaderProgram(this.linearGradShaderProgram);
      } else if (val.gradient === 'radial') {
        let d = Math.sqrt(
          Math.pow(p1[0]-p0[0], 2) +
          Math.pow(p1[1]-p0[1], 2)
        );

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

        if (r1 > d + r0) {
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

      gl.uniform1f(this.activeShaderProgram.uniforms['r0'], r0);
      gl.uniform1f(this.activeShaderProgram.uniforms['r1'], r1);
      gl.uniform2fv(this.activeShaderProgram.uniforms['p0'], p0);
      gl.uniform2fv(this.activeShaderProgram.uniforms['p1'], p1);
      let color_arr = [];
      let offset_arr = [];
      let sortedStops = val.stops.slice();
      if (reverse_stops) {
        sortedStops.sort(function(a, b) {
          return b[1] - a[1];
        });
      } else {
        sortedStops.sort(function(a, b) {
          return a[1] - b[1];
        });
      }
      for (i = 0; i < sortedStops.length; i++) {
        color_arr = color_arr.concat(sortedStops[i][0]);
        if (reverse_stops) {
          offset_arr.push(1-sortedStops[i][1]);
        } else {
          offset_arr.push(sortedStops[i][1]);
        }
      }
      offset_arr.push(-1.0);

      // TODO: can we rely on uniform arrays always ending up with [0] in their retrieved names across all platforms?
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
    } else if (val && typeof val === 'object' && 'pattern' in val) {
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
        val.pattern
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

    gl.enableVertexAttribArray(this.activeShaderProgram.attributes["aVertexPosition"]);
    gl.disableVertexAttribArray(this.activeShaderProgram.attributes["aTextPageCoord"]);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextEnabled"], 0);
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);
  }

  createLinearGradient(x0, y0, x1, y1) {
    var gradObj = this._createGradient('linear');
    gradObj.p0 = [x0, y0];
    gradObj.p1 = [x1, y1];
    return gradObj;
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
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
        parsedColor = parseColor(color);
        if (!parsedColor) {
          throw new SyntaxError('Bad color value');
        }
        if (offset < 0 || offset > 1) {
          throw new DOMException('Bad stop offset', 'IndexSizeError');
        }
        this.stops.push([cssToGlColor(color), offset]);
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

  createPattern(asset, repeat) {
    // TODO: make sure this doesn't pick up asset changes later on
    if (!repeat || repeat === '') {
      repeat = 'repeat';
    } else if (!(repeat in patternShaderRepeatValues)) {
      throw new SyntaxError('Bad repeat value');
    }
    var patternObj = {
      pattern: asset,
      repeat: repeat,
    };
    return patternObj;
  }

  _setShaderProgram(shaderProgram) {
    let gl = this.gl;
    if (this.activeShaderProgram != shaderProgram) {
      shaderProgram.bind();
      this.activeShaderProgram = shaderProgram;
      this._updateMatrixUniforms();
    }
  }


  drawFbForScience() {
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
    gl.uniform1i(this.activeShaderProgram.uniforms["uTextPages"], 1);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], true);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferTextureForScience);

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

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferForScience);

    gl.uniform1i(this.activeShaderProgram.uniforms['uSkipMVTransform'], false);

    if (this.stencilsEnabled == true) {
      gl.enable(gl.STENCIL_TEST);
    }
  }

  initFbForScience() {
    // TODO: this is to work around gl.readPixels not working on the ios default
    // framebuffer - remove once that's fixed
    let gl = this.gl;
    this.framebufferForScience = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferForScience);
    this.framebufferForScience.width = gl.drawingBufferWidth;
    this.framebufferForScience.height = gl.drawingBufferHeight;

    this.framebufferTextureForScience = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferTextureForScience);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                  this.framebufferForScience.width, this.framebufferForScience.height,
                  0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.framebufferTextureForScience, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8,
                           this.framebufferForScience.width, this.framebufferForScience.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  /**************************************************
   * Main
   **************************************************/

  constructor(gl) {
    // Paramters
    // TODO: how do we make these parameters more parameterizable?
    this.maxGradStops = 10;

    // TODO: find fonts?
    this.builtinFonts = {
      "cursive" : null, 
      "fantasy" : null, 
      "monospace" : couriernew, 
      "serif" : timesnewroman,
      "sans-serif" : calibri,
      "Courier New" : couriernew,
      "Times New Roman" : timesnewroman,
      "Calibri" : calibri,
    }

    // Initialization
    this.gl = gl;
    this.activeShaderProgram = null;

    this.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);

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

    this.initFbForScience();

    this.initDrawingState();
    this._setShaderProgram(this.flatShaderProgram);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(0, 0, 0, 0.0);
    gl.clearStencil(1);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    glm.mat4.ortho(
      this.pMatrix,
      0,
      gl.drawingBufferWidth,
      0,
      gl.drawingBufferHeight, // TODO: top and bottom are swapped while drawFbForScience() is in use - change this back once its taken out
      -1,
      1
    );
    glm.mat4.identity(this.drawingState.mvMatrix);
    this._updateMatrixUniforms();

    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT |
      this.gl.DEPTH_BUFFER_BIT |
      this.gl.STENCIL_BUFFER_BIT
    );

    if (!(gl.getParameter(gl.STENCIL_BITS)>=2)) {
      console.log("WARNING: Was given " + gl.getParameter(gl.STENCIL_BITS) + " stencil bits - clipping will be broken");
    }

  }

  flush() {
    this.drawFbForScience();
    this.gl.endFrameEXP();
  }
}

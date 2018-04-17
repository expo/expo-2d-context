var stringFormat = require('string-format');

// TODO: move fragColor into header?

const shaderHeaderTxt = `
  #version 300 es
  #define M_PI 3.1415926535897932384626433832795
  precision lowp int;
  precision mediump float;
  precision mediump sampler2DArray;
`;

const textVertShaderTxt = `
  in vec3 aTextPageCoord;
  uniform bool uTextEnabled;
  out vec3 vTextPageCoord;

  void runTextVertShader(void) {
    if (uTextEnabled) {
      vTextPageCoord = aTextPageCoord;
    }
  }
`;

const textFragShaderTxt = `
  uniform sampler2DArray uTextPages;
  uniform bool uTextEnabled;
  uniform float uTextDistanceFieldThreshold;
  uniform float uTextStrokeWidth;

  in vec3 vTextPageCoord;

  float runTextFragShader() {
    if (uTextEnabled) {
      float textMask = texture(uTextPages, vTextPageCoord).a;
      if (uTextStrokeWidth < 0.0) {
        if (textMask < uTextDistanceFieldThreshold) {
          textMask = 0.0;
        } else {
          textMask = 1.0;
        }
      } else {
        float lowerThreshold = max(0.0001, uTextDistanceFieldThreshold - uTextStrokeWidth);
        float upperThreshold = min(0.9999, uTextDistanceFieldThreshold + uTextStrokeWidth);
        if (textMask < lowerThreshold || textMask > upperThreshold) {
          textMask = 0.0;
        } else {
          textMask = 1.0;
        }
      }
      return textMask;
    } else {
      return 1.0;
    }
  }
`;

export const flatShaderTxt = {
  vert:
      shaderHeaderTxt +
      textVertShaderTxt + `
      in vec2 aVertexPosition;

      uniform bool uSkipMVTransform;

      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;

      void main(void) {
        if (uSkipMVTransform) {
          gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);
        } else {
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);
        }
        runTextVertShader();
      }
    `,
  frag:
      shaderHeaderTxt +
      textFragShaderTxt + `

      uniform vec4 uColor;
      uniform float uGlobalAlpha;

      out vec4 fragColor;

      void main(void) {
        fragColor = uColor * vec4(1, 1, 1, uGlobalAlpha);
        fragColor.a *= runTextFragShader();
      }
    `,
};

const gradMapperFragShaderTxt = `
  const int MAX_STOPS = {maxGradStops};
  uniform vec4 colors[MAX_STOPS];
  uniform float offsets[MAX_STOPS];

  vec4 mapToGradStop(float t) {
    vec4 stopColor = colors[0];
    for(int i = 0; i < MAX_STOPS; i ++) {
      if (offsets[i+1] == -1.0) {
        stopColor = colors[i];
        break;
      }
      if (t >= offsets[i] && t < offsets[i+1] ) {
        float stopOffset = t-offsets[i];
        stopOffset /= offsets[i+1] - offsets[i];
        stopColor = mix(colors[i], colors[i+1], stopOffset);
        break;
      }
    }
    return stopColor;
  }


`;

export const linearGradShaderTxt = {
  vert:
      shaderHeaderTxt +
      textVertShaderTxt + `

      in vec2 aVertexPosition;

      out vec2 vP2;

      uniform bool uSkipMVTransform;

      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;

      uniform mat4 uiMVMatrix;

      void main(void) {
        if (uSkipMVTransform) {
          gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);
          vP2 = (uiMVMatrix * vec4(aVertexPosition, 0.0, 1.0)).xy;
        } else {
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);
          vP2 = aVertexPosition.xy;
        }
        runTextVertShader();
      }
    `,
  frag:
    shaderHeaderTxt +
    textFragShaderTxt +
    gradMapperFragShaderTxt + `
    
    uniform vec2 p0;
    uniform vec2 p1;

    in vec2 vP2;

    out vec4 fragColor;

    uniform float uGlobalAlpha;

    void main() {
      // Project coordinate onto gradient spectrum

      vec2 p1p0 = p1 - p0;
      vec2 p2p0 = vP2 - p0;
      float t = dot(p2p0, p1p0) / dot(p1p0, p1p0);

      t = clamp(t, 0.0, 1.0);

      // Map to color

      fragColor = mapToGradStop(t);
      fragColor *= vec4(1, 1, 1, uGlobalAlpha);
      fragColor.a *= runTextFragShader();
    }
  `,
};

export const radialGradShaderTxt = {
  vert:
    shaderHeaderTxt +
    textVertShaderTxt + `

    in vec2 aVertexPosition;

    out vec2 vP2;

    uniform bool uSkipMVTransform;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    uniform mat4 uiMVMatrix;

    void main(void) {
      if (uSkipMVTransform) {
        gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);
        vP2 = (uiMVMatrix * vec4(aVertexPosition, 0.0, 1.0)).xy;
      } else {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);
        vP2 = aVertexPosition.xy;
      }
      runTextVertShader();
    }
  `,
  frag:
    shaderHeaderTxt +
    textFragShaderTxt +
    gradMapperFragShaderTxt + `

    uniform vec2 p0;
    uniform float r0;

    uniform vec2 p1;
    uniform float r1;

    uniform bool uCirclesTouching;

    in vec2 vP2;

    out vec4 fragColor;

    uniform float uGlobalAlpha;

    void main() {

      if (uCirclesTouching) {
        vec2 gradLine = normalize(p1-p0);
        vec2 touchPt = p0 - gradLine*r0;
        if (dot(vP2-touchPt, gradLine) < 0.0) {
          fragColor = vec4(1,1,1,0);
          return;          
        }
      }

      // Project coordinate onto gradient spectrum
      float t;
      if (distance(vP2, p0) < r0) {
        t = 0.0;
      } else if (distance(vP2, p1) > r1) {
        t = 1.0;
      } else {
        vec2 p2p0 = vP2 - p0;
        float c0theta = atan(p2p0.y, p2p0.x);
        vec2 radialP0 = vec2(r0*cos(c0theta), r0*sin(c0theta)) + p0;

        //vec2 radialP1 = vec2(r1*cos(c0theta), r1*sin(c0theta)) + p0;

        vec2 e = normalize(radialP0 - vP2);
        vec2 h = p1 - radialP0;
        float lf = dot(e,h);
        float s = r1*r1-dot(h,h)+lf*lf;

        // TODO: if s < 0, no intersection pts, what to do?
        s = sqrt(s);

        vec2 radialP1;
        if (lf < s) {
          if (lf + s >= 0.0) {
            s = -s;
            // TODO: tangent pt. wtf.
          }
          // TODO: else no intersection? wtf?
        } else {
          radialP1 = e*(lf-s) + radialP0;
        }

        vec2 rp1p0 = radialP1 - radialP0;
        vec2 rp2p0 = vP2 - radialP0;
        t = dot(rp2p0, rp1p0) / dot(rp1p0, rp1p0);
      }

      t = clamp(t, 0.0, 1.0);

      // Map to color

      fragColor = mapToGradStop(t);
      fragColor.a *= uGlobalAlpha;
      fragColor.a *= runTextFragShader();
    }
  `,
};

export const disjointRadialGradShaderTxt = {
  vert:
    shaderHeaderTxt +
    textVertShaderTxt + `

    in vec2 aVertexPosition;

    out vec2 vP2;

    uniform bool uSkipMVTransform;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    uniform mat4 uiMVMatrix;

    void main(void) {
      if (uSkipMVTransform) {
        gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);
        vP2 = (uiMVMatrix * vec4(aVertexPosition, 0.0, 1.0)).xy;
      } else {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);
        vP2 = aVertexPosition.xy;
      }
      runTextVertShader();
    }
  `,
  frag:
    shaderHeaderTxt +
    textFragShaderTxt +
    gradMapperFragShaderTxt + `

      uniform vec2 p0;
      uniform vec2 p1;
      uniform float r0;
      uniform float r1;

      uniform vec2 uPinchPt;


      in vec2 vP2;

      out vec4 fragColor;

      uniform float uGlobalAlpha;
      uniform bool uStopDirection;

      void circleIntersection(in vec2 testPt, in vec2 pinchPt, in vec2 circlePt, in float circleRad, in bool stopDirection, out vec2 intersection, out bool valid){
        // TODO: this routine seems to be numerically unstable
        //  on some platforms when floats are mediump/lowp - quantify
        //  exactly where this becomes a problem

        vec2 p2p0 = testPt - pinchPt;
        vec2 p1p0 = circlePt - pinchPt;
        float proj_t = dot(p2p0,p1p0) / pow(length(p2p0),2.0);
        if (proj_t < 0.0) {
          valid = false;
          return;
        }

        highp vec2 p2p1 = testPt - circlePt;
        highp vec2 p0p1 = pinchPt - circlePt;

        highp float dx = p2p1.x - p0p1.x;
        highp float dy = p2p1.y - p0p1.y; // ABSing this fixes bad solution detection? is that the right thing to do?
        highp float dr = sqrt(dx*dx + dy*dy);
        highp float D = (p0p1.x*p2p1.y) - (p2p1.x*p0p1.y);

        highp float discriminant = pow(circleRad*dr,2.0)-pow(D,2.0);

        if (dr == 0.0) {
          valid = false;
          return;
        }

        if (discriminant <= 0.0) {
          valid = false;
          return;
        }

        float dysgn = (dy < 0.0) ? -1.0 : 1.0;
        float stopDirectionSgn = (stopDirection) ? -dysgn:dysgn;
    
        intersection = vec2(
            ( D*dy + stopDirectionSgn*dysgn*dx*sqrt(discriminant)) / pow(dr,2.0),
            (-D*dx + stopDirectionSgn*abs(dy) *sqrt(discriminant)) / pow(dr,2.0)
        );
        intersection += circlePt;
        valid = true;

        return;
      }

      void main() {

        // Project coordinate onto gradient spectrum
        // TODO: describe the geometry here

        float t = 0.0;

        vec2 pinchPt;
        bool stopDirection;
        bool skipGradCalc = false;

        // TODO: decompose main into mainEqualRadii() and mainUnequalRadii()
        // TODO: solution selection is inconsistent with ''var g = ctx.createRadialGradient(230, 25, 50, 100, 25, 20);''

        if (r0 == r1) {
          vec2 gradDirection = normalize(p1-p0);
          float vP2projection = dot(vP2-p0, gradDirection);
          if (vP2projection < -r0) {
            t = 0.0;
            skipGradCalc = true;
            vec2 vP2projectionPt = p0 + vP2projection*gradDirection;
            if (length(vP2projectionPt-vP2) > r0) {
              fragColor = vec4(1,1,1,0);
              return;
            }
          } else if (vP2projection > length(p1-p0)+r0) {
            t = 1.0;
            vec2 vP2projectionPt = p0 + vP2projection*gradDirection;
            if (length(vP2projectionPt-vP2) > r0) {
              fragColor = vec4(1,1,1,0);
              return;
            }
            skipGradCalc = true;
          } else {
            pinchPt = vP2 - gradDirection*max(length(vP2-p0),r0)*2.0;
          }
          stopDirection = !uStopDirection;
        } else {
          pinchPt = uPinchPt;
          stopDirection = uStopDirection;
        }

        if (!skipGradCalc) {
          vec2 intersection0;
          vec2 intersection1;
          bool valid0;
          bool valid1;

          circleIntersection(
            vP2,                   // test point
            pinchPt,               // "pinch" point
            p0, r0,                // circle center/radius
            stopDirection,        // solution selection
            intersection0, valid0  // outputs
          );

          circleIntersection(
            vP2,                   // test point
            pinchPt,               // "pinch" point
            p1, r1,                // circle center/radius
            stopDirection,        // solution selection
            intersection1, valid1  // outputs
          );

          if (!valid0 || !valid1) {
            fragColor = vec4(1,1,1,0);
            return;
          }

          vec2 gradLine = normalize(vP2 - pinchPt);

          float minPt = dot(intersection0-pinchPt, gradLine);
          float maxPt = dot(intersection1-pinchPt, gradLine) - minPt;
          float fragPt = dot(vP2-pinchPt, gradLine) - minPt;

          fragPt = clamp(fragPt, 0.0, maxPt);
          t = fragPt / maxPt;
        }


        // Map to color

        fragColor = mapToGradStop(t);
        fragColor.a *= uGlobalAlpha;
        fragColor.a *= runTextFragShader();
      }
    `,
};

export const patternShaderRepeatValues = {
  'no-repeat': 0,
  'repeat-x': 1,
  'repeat-y': 2,
  'repeat': 3,
  'src-rect': 4, // Only used for drawImage()
};

export const patternShaderTxt = {
  vert: 
    shaderHeaderTxt +
    textVertShaderTxt +
    stringFormat(`

      in vec2 aVertexPosition;
      in vec2 aTexCoord;

      uniform bool uSkipMVTransform;

      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;

      uniform int uRepeatMode;
      uniform vec2 uTextureSize;
      out vec2 vTexCoord;

      uniform mat4 uiMVMatrix;

      void main(void) {
        if (uSkipMVTransform) {
          gl_Position = uPMatrix * vec4(aVertexPosition, 0.0, 1.0);
          vTexCoord = (uiMVMatrix * vec4(aVertexPosition, 0.0, 1.0)).xy / uTextureSize;
        } else {
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.0, 1.0);
          vTexCoord = aVertexPosition / uTextureSize;
        }

        if (uRepeatMode == {src-rect}) {
          vTexCoord = aTexCoord;
        }

        runTextVertShader();
      }
    `,
    patternShaderRepeatValues
  ),
  frag:
    shaderHeaderTxt + 
    textFragShaderTxt +
    stringFormat(`

      uniform int uRepeatMode;
      uniform sampler2D uTexture;
      in vec2 vTexCoord;
      uniform float uGlobalAlpha;

      out vec4 fragColor;

      void main(void) {
        if ((uRepeatMode == {no-repeat} || uRepeatMode == {src-rect}) && (
          vTexCoord.x < 0.0 || vTexCoord.x > 1.0 ||
        vTexCoord.y < 0.0 || vTexCoord.y > 1.0))
        {
          fragColor = vec4(0,0,0,0);
        } else if (uRepeatMode == {repeat-x} && (
        vTexCoord.y < 0.0 || vTexCoord.y > 1.0))
        {
          fragColor = vec4(0,0,0,0);
        } else if (uRepeatMode == {repeat-y} && (
        vTexCoord.x < 0.0 || vTexCoord.x > 1.0))
        {
          fragColor = vec4(0,0,0,0);
        } else {
          vec2 wrappedCoord = mod(vTexCoord, 1.0);
          fragColor = texture(uTexture, wrappedCoord).rgba;
          fragColor.a *= uGlobalAlpha;
        }

        fragColor.a *= runTextFragShader();
      }
    `,
    patternShaderRepeatValues
  ),
};

export class ShaderProgram {
  constructor(gl, vertShaderTxt, fragShaderTxt) {
    this.gl = gl;

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderTxt);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new SyntaxError(
        'Error compiling vertex shader: \n' + gl.getShaderInfoLog(vertShader)
      );
    }

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderTxt);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new SyntaxError(
        'Error compiling fragment shader: \n' + gl.getShaderInfoLog(fragShader)
      );
    }

    this.programHandle = gl.createProgram();
    gl.attachShader(this.programHandle, vertShader);
    gl.attachShader(this.programHandle, fragShader);
    gl.linkProgram(this.programHandle);

    if (!gl.getProgramParameter(this.programHandle, gl.LINK_STATUS)) {
      throw new SyntaxError(
        'Error linking shader program: \n' + gl.getProgramInfoLog(this.programHandle)
      );
    }

    gl.useProgram(this.programHandle);


    this.attributes = {};
    nAttributes = gl.getProgramParameter(this.programHandle, gl.ACTIVE_ATTRIBUTES);
    names = [];
    for (i = 0; i < nAttributes; i++) {
      attr = gl.getActiveAttrib(this.programHandle, i);
      names.push(attr.name);
      this.attributes[attr.name] = gl.getAttribLocation(
        this.programHandle,
        attr.name
      );
      gl.enableVertexAttribArray(this.attributes[attr.name]);
    }

    this.uniforms = {};
    nUniforms = gl.getProgramParameter(this.programHandle, gl.ACTIVE_UNIFORMS);
    names = [];
    for (i = 0; i < nUniforms; i++) {
      uniform = gl.getActiveUniform(this.programHandle, i);
      names.push(uniform.name);
      this.uniforms[uniform.name] = gl.getUniformLocation(
        this.programHandle,
        uniform.name
      );
    }
  }

  bind() {
    this.gl.useProgram(this.programHandle);
  }
}

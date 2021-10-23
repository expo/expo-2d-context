import convert from 'color-convert';

const x11ColorTable = {
  aliceblue: [0.941176, 0.972549, 1.0, 1.0],
  antiquewhite: [0.980392, 0.921569, 0.843137, 1.0],
  aqua: [0.0, 1.0, 1.0, 1.0],
  aquamarine: [0.498039, 1.0, 0.831373, 1.0],
  azure: [0.941176, 1.0, 1.0, 1.0],
  beige: [0.960784, 0.960784, 0.862745, 1.0],
  bisque: [1.0, 0.894118, 0.768627, 1.0],
  black: [0.0, 0.0, 0.0, 1.0],
  blanchedalmond: [1.0, 0.921569, 0.803922, 1.0],
  blue: [0.0, 0.0, 1.0, 1.0],
  blueviolet: [0.541176, 0.168627, 0.886275, 1.0],
  brown: [0.647059, 0.164706, 0.164706, 1.0],
  burlywood: [0.870588, 0.721569, 0.529412, 1.0],
  cadetblue: [0.372549, 0.619608, 0.627451, 1.0],
  chartreuse: [0.498039, 1.0, 0.0, 1.0],
  chocolate: [0.823529, 0.411765, 0.117647, 1.0],
  coral: [1.0, 0.498039, 0.313725, 1.0],
  cornflowerblue: [0.392157, 0.584314, 0.929412, 1.0],
  cornsilk: [1.0, 0.972549, 0.862745, 1.0],
  crimson: [0.862745, 0.078431, 0.235294, 1.0],
  cyan: [0.0, 1.0, 1.0, 1.0],
  darkblue: [0.0, 0.0, 0.545098, 1.0],
  darkcyan: [0.0, 0.545098, 0.545098, 1.0],
  darkgoldenrod: [0.721569, 0.52549, 0.043137, 1.0],
  darkgray: [0.662745, 0.662745, 0.662745, 1.0],
  darkgreen: [0.0, 0.392157, 0.0, 1.0],
  darkgrey: [0.662745, 0.662745, 0.662745, 1.0],
  darkkhaki: [0.741176, 0.717647, 0.419608, 1.0],
  darkmagenta: [0.545098, 0.0, 0.545098, 1.0],
  darkolivegreen: [0.333333, 0.419608, 0.184314, 1.0],
  darkorange: [1.0, 0.54902, 0.0, 1.0],
  darkorchid: [0.6, 0.196078, 0.8, 1.0],
  darkred: [0.545098, 0.0, 0.0, 1.0],
  darksalmon: [0.913725, 0.588235, 0.478431, 1.0],
  darkseagreen: [0.560784, 0.737255, 0.560784, 1.0],
  darkslateblue: [0.282353, 0.239216, 0.545098, 1.0],
  darkslategray: [0.184314, 0.309804, 0.309804, 1.0],
  darkslategrey: [0.184314, 0.309804, 0.309804, 1.0],
  darkturquoise: [0.0, 0.807843, 0.819608, 1.0],
  darkviolet: [0.580392, 0.0, 0.827451, 1.0],
  deeppink: [1.0, 0.078431, 0.576471, 1.0],
  deepskyblue: [0.0, 0.74902, 1.0, 1.0],
  dimgray: [0.411765, 0.411765, 0.411765, 1.0],
  dimgrey: [0.411765, 0.411765, 0.411765, 1.0],
  dodgerblue: [0.117647, 0.564706, 1.0, 1.0],
  firebrick: [0.698039, 0.133333, 0.133333, 1.0],
  floralwhite: [1.0, 0.980392, 0.941176, 1.0],
  forestgreen: [0.133333, 0.545098, 0.133333, 1.0],
  fuchsia: [1.0, 0.0, 1.0, 1.0],
  gainsboro: [0.862745, 0.862745, 0.862745, 1.0],
  ghostwhite: [0.972549, 0.972549, 1.0, 1.0],
  gold: [1.0, 0.843137, 0.0, 1.0],
  goldenrod: [0.854902, 0.647059, 0.12549, 1.0],
  gray: [0.501961, 0.501961, 0.501961, 1.0],
  green: [0.0, 0.501961, 0.0, 1.0],
  greenyellow: [0.678431, 1.0, 0.184314, 1.0],
  grey: [0.501961, 0.501961, 0.501961, 1.0],
  honeydew: [0.941176, 1.0, 0.941176, 1.0],
  hotpink: [1.0, 0.411765, 0.705882, 1.0],
  indianred: [0.803922, 0.360784, 0.360784, 1.0],
  indigo: [0.294118, 0.0, 0.509804, 1.0],
  ivory: [1.0, 1.0, 0.941176, 1.0],
  khaki: [0.941176, 0.901961, 0.54902, 1.0],
  lavender: [0.901961, 0.901961, 0.980392, 1.0],
  lavenderblush: [1.0, 0.941176, 0.960784, 1.0],
  lawngreen: [0.486275, 0.988235, 0.0, 1.0],
  lemonchiffon: [1.0, 0.980392, 0.803922, 1.0],
  lightblue: [0.678431, 0.847059, 0.901961, 1.0],
  lightcoral: [0.941176, 0.501961, 0.501961, 1.0],
  lightcyan: [0.878431, 1.0, 1.0, 1.0],
  lightgoldenrodyellow: [0.980392, 0.980392, 0.823529, 1.0],
  lightgray: [0.827451, 0.827451, 0.827451, 1.0],
  lightgreen: [0.564706, 0.933333, 0.564706, 1.0],
  lightgrey: [0.827451, 0.827451, 0.827451, 1.0],
  lightpink: [1.0, 0.713725, 0.756863, 1.0],
  lightsalmon: [1.0, 0.627451, 0.478431, 1.0],
  lightseagreen: [0.12549, 0.698039, 0.666667, 1.0],
  lightskyblue: [0.529412, 0.807843, 0.980392, 1.0],
  lightslategray: [0.466667, 0.533333, 0.6, 1.0],
  lightslategrey: [0.466667, 0.533333, 0.6, 1.0],
  lightsteelblue: [0.690196, 0.768627, 0.870588, 1.0],
  lightyellow: [1.0, 1.0, 0.878431, 1.0],
  lime: [0.0, 1.0, 0.0, 1.0],
  limegreen: [0.196078, 0.803922, 0.196078, 1.0],
  linen: [0.980392, 0.941176, 0.901961, 1.0],
  magenta: [1.0, 0.0, 1.0, 1.0],
  maroon: [0.501961, 0.0, 0.0, 1.0],
  mediumaquamarine: [0.4, 0.803922, 0.666667, 1.0],
  mediumblue: [0.0, 0.0, 0.803922, 1.0],
  mediumorchid: [0.729412, 0.333333, 0.827451, 1.0],
  mediumpurple: [0.576471, 0.439216, 0.858824, 1.0],
  mediumseagreen: [0.235294, 0.701961, 0.443137, 1.0],
  mediumslateblue: [0.482353, 0.407843, 0.933333, 1.0],
  mediumspringgreen: [0.0, 0.980392, 0.603922, 1.0],
  mediumturquoise: [0.282353, 0.819608, 0.8, 1.0],
  mediumvioletred: [0.780392, 0.082353, 0.521569, 1.0],
  midnightblue: [0.098039, 0.098039, 0.439216, 1.0],
  mintcream: [0.960784, 1.0, 0.980392, 1.0],
  mistyrose: [1.0, 0.894118, 0.882353, 1.0],
  moccasin: [1.0, 0.894118, 0.709804, 1.0],
  navajowhite: [1.0, 0.870588, 0.678431, 1.0],
  navy: [0.0, 0.0, 0.501961, 1.0],
  oldlace: [0.992157, 0.960784, 0.901961, 1.0],
  olive: [0.501961, 0.501961, 0.0, 1.0],
  olivedrab: [0.419608, 0.556863, 0.137255, 1.0],
  orange: [1.0, 0.647059, 0.0, 1.0],
  orangered: [1.0, 0.270588, 0.0, 1.0],
  orchid: [0.854902, 0.439216, 0.839216, 1.0],
  palegoldenrod: [0.933333, 0.909804, 0.666667, 1.0],
  palegreen: [0.596078, 0.984314, 0.596078, 1.0],
  paleturquoise: [0.686275, 0.933333, 0.933333, 1.0],
  palevioletred: [0.858824, 0.439216, 0.576471, 1.0],
  papayawhip: [1.0, 0.937255, 0.835294, 1.0],
  peachpuff: [1.0, 0.854902, 0.72549, 1.0],
  peru: [0.803922, 0.521569, 0.247059, 1.0],
  pink: [1.0, 0.752941, 0.796078, 1.0],
  plum: [0.866667, 0.627451, 0.866667, 1.0],
  powderblue: [0.690196, 0.878431, 0.901961, 1.0],
  purple: [0.501961, 0.0, 0.501961, 1.0],
  rebeccapurple: [0.4, 0.2, 0.6, 1.0],
  red: [1.0, 0.0, 0.0, 1.0],
  rosybrown: [0.737255, 0.560784, 0.560784, 1.0],
  royalblue: [0.254902, 0.411765, 0.882353, 1.0],
  saddlebrown: [0.545098, 0.270588, 0.07451, 1.0],
  salmon: [0.980392, 0.501961, 0.447059, 1.0],
  sandybrown: [0.956863, 0.643137, 0.376471, 1.0],
  seagreen: [0.180392, 0.545098, 0.341176, 1.0],
  seashell: [1.0, 0.960784, 0.933333, 1.0],
  sienna: [0.627451, 0.321569, 0.176471, 1.0],
  silver: [0.752941, 0.752941, 0.752941, 1.0],
  skyblue: [0.529412, 0.807843, 0.921569, 1.0],
  slateblue: [0.415686, 0.352941, 0.803922, 1.0],
  slategray: [0.439216, 0.501961, 0.564706, 1.0],
  slategrey: [0.439216, 0.501961, 0.564706, 1.0],
  snow: [1.0, 0.980392, 0.980392, 1.0],
  springgreen: [0.0, 1.0, 0.498039, 1.0],
  steelblue: [0.27451, 0.509804, 0.705882, 1.0],
  tan: [0.823529, 0.705882, 0.54902, 1.0],
  teal: [0.0, 0.501961, 0.501961, 1.0],
  thistle: [0.847059, 0.74902, 0.847059, 1.0],
  tomato: [1.0, 0.388235, 0.278431, 1.0],
  turquoise: [0.25098, 0.878431, 0.815686, 1.0],
  violet: [0.933333, 0.509804, 0.933333, 1.0],
  wheat: [0.960784, 0.870588, 0.701961, 1.0],
  white: [1.0, 1.0, 1.0, 1.0],
  whitesmoke: [0.960784, 0.960784, 0.960784, 1.0],
  yellow: [1.0, 1.0, 0.0, 1.0],
  yellowgreen: [0.603922, 0.803922, 0.196078, 1.0],
  transparent: [0.0, 0.0, 0.0, 0.0],
};

const numberRegex = /(-?[0-9]*\.?[0-9]+([eE][0-9]+)?)/;

function parseAngleArg(arg) {
  const matches = new RegExp(
    numberRegex.source + /([dD][eE][gG]|[gG][rR][aA][dD]|[rR][aA][dD]|[tT][uU][rR][nN])?$/.source
  ).exec(arg);
  if (!matches) {
    throw new Error('Bad Color');
  }
  const value = Number(matches[1]);
  if (!isFinite(value)) {
    throw new Error('Bad Color');
  }
  const unit = (matches[3] || 'DEG').toUpperCase();
  if (unit === 'DEG') {
    return value;
  } else if (unit === 'GRAD') {
    return value * 0.9;
  } else if (unit === 'RAD') {
    return (value * 180) / Math.PI;
  } else if (unit === 'TURN') {
    return value * 360;
  } else {
    throw new Error('Bad Color');
  }
}

function parseNumberPercentageArg(arg, opts) {
  opts.min = isFinite(opts.min) ? opts.min : NaN;
  opts.max = isFinite(opts.max) ? opts.max : 255;
  opts.percentageRequired = opts.percentageRequired || false;

  const matches = new RegExp(numberRegex.source + /(%)?$/.source).exec(arg);
  if (!matches) {
    throw new Error('Bad Color');
  }
  let value = Number(matches[1]);
  if (isNaN(value)) {
    throw new Error('Bad Color');
  }
  if (matches[3]) {
    value = opts.max * value * 0.01;
  } else {
    if (opts.percentageRequired) {
      throw new Error('Bad Color');
    }
  }
  if (isFinite(opts.min) && value < opts.min) {
    value = opts.min;
  } else if (value > opts.max) {
    value = opts.max;
  }
  return value;
}

function parseComponentFunctionArgs(args) {
  let parsedArgs = /^\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,]+)\s*(\/\s*([^\s]+)\s*)?$/.exec(args);
  if (!parsedArgs) {
    parsedArgs = /^\s*([^\s,]+)\s*,\s*([^\s,]+)\s*,\s*([^\s,]+)\s*(,\s*([^\s]+)\s*)?$/.exec(args);
  }
  if (!parsedArgs) {
    throw new Error('Bad Color');
  }
  return [parsedArgs[1], parsedArgs[2], parsedArgs[3], parsedArgs[5]];
}

export default function cssToGlColor(cssStr) {
  if (cssStr === '' || cssStr === undefined) {
    throw new Error('Bad Color');
  }

  cssStr = cssStr.trim().toLowerCase();

  if (cssStr.charAt(0) === '#') {
    // Hex
    const hexdigits = cssStr.substring(1);
    if (/^[a-f0-9]+$/.exec(hexdigits) == null) {
      throw new Error('Bad Color');
    }
    if (hexdigits.length === 3) {
      return [
        parseInt(hexdigits.substring(0, 1), 16) / 15,
        parseInt(hexdigits.substring(1, 2), 16) / 15,
        parseInt(hexdigits.substring(2, 3), 16) / 15,
        1.0,
      ];
    } else if (hexdigits.length === 4) {
      return [
        parseInt(hexdigits.substring(0, 1), 16) / 15,
        parseInt(hexdigits.substring(1, 2), 16) / 15,
        parseInt(hexdigits.substring(2, 3), 16) / 15,
        parseInt(hexdigits.substring(3, 4), 16) / 15,
      ];
    } else if (hexdigits.length === 6) {
      return [
        parseInt(hexdigits.substring(0, 2), 16) / 255,
        parseInt(hexdigits.substring(2, 4), 16) / 255,
        parseInt(hexdigits.substring(4, 6), 16) / 255,
        1.0,
      ];
    } else if (hexdigits.length === 8) {
      return [
        parseInt(hexdigits.substring(0, 2), 16) / 255,
        parseInt(hexdigits.substring(2, 4), 16) / 255,
        parseInt(hexdigits.substring(4, 6), 16) / 255,
        parseInt(hexdigits.substring(6, 8), 16) / 255,
      ];
    } else {
      throw new Error('Bad Color');
    }
  } else {
    const matches = /\s*([a-z-]+)\(([^)]+)\)?\s*$/.exec(cssStr);
    if (matches == null) {
      // Named color
      if (cssStr in x11ColorTable) {
        return x11ColorTable[cssStr];
      } else {
        throw new Error('Bad Color');
      }
    } else {
      // Color function
      const func = matches[1];
      const args = matches[2];
      if (func === 'rgb' || func === 'rgba') {
        const parsedArgs = parseComponentFunctionArgs(args);

        // Enforce either all are percentages or none are
        const isPercentage = parsedArgs.map((v) => (v || '').includes('%'));
        if (!(isPercentage[0] === isPercentage[1] && isPercentage[1] === isPercentage[2])) {
          throw new Error('Bad Color');
        }

        const r = parseNumberPercentageArg(parsedArgs[0], { min: 0, max: 255 }) / 255;
        const g = parseNumberPercentageArg(parsedArgs[1], { min: 0, max: 255 }) / 255;
        const b = parseNumberPercentageArg(parsedArgs[2], { min: 0, max: 255 }) / 255;
        const a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {
          min: 0,
          max: 1,
        });
        return [r, g, b, a];
      } else if (func === 'hsl' || func === 'hsla') {
        const parsedArgs = parseComponentFunctionArgs(args);
        const h = parseAngleArg(parsedArgs[0]) % 360;
        const s = parseNumberPercentageArg(parsedArgs[1], {
          min: 0,
          max: 1,
          percentageRequired: true,
        });
        const l = parseNumberPercentageArg(parsedArgs[2], {
          min: 0,
          max: 1,
          percentageRequired: true,
        });
        const a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {
          min: 0,
          max: 1,
        });
        const converted = convert.hsl.rgb(h, s * 100, l * 100);
        return [converted[0] / 255, converted[1] / 255, converted[2] / 255, a];
      } else if (func === 'hwb') {
        // TODO: disallow comma notation?
        const parsedArgs = parseComponentFunctionArgs(args);
        const h = parseAngleArg(parsedArgs[0]) % 360;
        let w = parseNumberPercentageArg(parsedArgs[1], {
          min: 0,
          max: 1,
          percentageRequired: true,
        });
        let b = parseNumberPercentageArg(parsedArgs[2], {
          min: 0,
          max: 1,
          percentageRequired: true,
        });
        const a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {
          min: 0,
          max: 1,
        });
        if (w + b > 1) {
          const ratio = w / b;
          b = 1 / (1 + ratio);
          w = 1 - b;
        }
        const converted = convert.hsl.rgb(h, 100, 50);
        for (let i = 0; i < 3; i++) {
          converted[i] *= (1 - w - b) / 255;
          converted[i] += w;
        }
        converted.push(a);
        return converted;
      } else if (func === 'gray') {
        throw new Error('Bad Color');
      } else if (func === 'device-cmyk') {
        throw new Error('Bad Color');
      } else {
        throw new Error('Bad Color');
      }
    }
  }
}

var convert = require('color-convert');

var x11ColorTable = {
  'aliceblue': [0.941176,0.972549,1.000000,1.000000],
  'antiquewhite': [0.980392,0.921569,0.843137,1.000000],
  'aqua': [0.000000,1.000000,1.000000,1.000000],
  'aquamarine': [0.498039,1.000000,0.831373,1.000000],
  'azure': [0.941176,1.000000,1.000000,1.000000],
  'beige': [0.960784,0.960784,0.862745,1.000000],
  'bisque': [1.000000,0.894118,0.768627,1.000000],
  'black': [0.000000,0.000000,0.000000,1.000000],
  'blanchedalmond': [1.000000,0.921569,0.803922,1.000000],
  'blue': [0.000000,0.000000,1.000000,1.000000],
  'blueviolet': [0.541176,0.168627,0.886275,1.000000],
  'brown': [0.647059,0.164706,0.164706,1.000000],
  'burlywood': [0.870588,0.721569,0.529412,1.000000],
  'cadetblue': [0.372549,0.619608,0.627451,1.000000],
  'chartreuse': [0.498039,1.000000,0.000000,1.000000],
  'chocolate': [0.823529,0.411765,0.117647,1.000000],
  'coral': [1.000000,0.498039,0.313725,1.000000],
  'cornflowerblue': [0.392157,0.584314,0.929412,1.000000],
  'cornsilk': [1.000000,0.972549,0.862745,1.000000],
  'crimson': [0.862745,0.078431,0.235294,1.000000],
  'cyan': [0.000000,1.000000,1.000000,1.000000],
  'darkblue': [0.000000,0.000000,0.545098,1.000000],
  'darkcyan': [0.000000,0.545098,0.545098,1.000000],
  'darkgoldenrod': [0.721569,0.525490,0.043137,1.000000],
  'darkgray': [0.662745,0.662745,0.662745,1.000000],
  'darkgreen': [0.000000,0.392157,0.000000,1.000000],
  'darkgrey': [0.662745,0.662745,0.662745,1.000000],
  'darkkhaki': [0.741176,0.717647,0.419608,1.000000],
  'darkmagenta': [0.545098,0.000000,0.545098,1.000000],
  'darkolivegreen': [0.333333,0.419608,0.184314,1.000000],
  'darkorange': [1.000000,0.549020,0.000000,1.000000],
  'darkorchid': [0.600000,0.196078,0.800000,1.000000],
  'darkred': [0.545098,0.000000,0.000000,1.000000],
  'darksalmon': [0.913725,0.588235,0.478431,1.000000],
  'darkseagreen': [0.560784,0.737255,0.560784,1.000000],
  'darkslateblue': [0.282353,0.239216,0.545098,1.000000],
  'darkslategray': [0.184314,0.309804,0.309804,1.000000],
  'darkslategrey': [0.184314,0.309804,0.309804,1.000000],
  'darkturquoise': [0.000000,0.807843,0.819608,1.000000],
  'darkviolet': [0.580392,0.000000,0.827451,1.000000],
  'deeppink': [1.000000,0.078431,0.576471,1.000000],
  'deepskyblue': [0.000000,0.749020,1.000000,1.000000],
  'dimgray': [0.411765,0.411765,0.411765,1.000000],
  'dimgrey': [0.411765,0.411765,0.411765,1.000000],
  'dodgerblue': [0.117647,0.564706,1.000000,1.000000],
  'firebrick': [0.698039,0.133333,0.133333,1.000000],
  'floralwhite': [1.000000,0.980392,0.941176,1.000000],
  'forestgreen': [0.133333,0.545098,0.133333,1.000000],
  'fuchsia': [1.000000,0.000000,1.000000,1.000000],
  'gainsboro': [0.862745,0.862745,0.862745,1.000000],
  'ghostwhite': [0.972549,0.972549,1.000000,1.000000],
  'gold': [1.000000,0.843137,0.000000,1.000000],
  'goldenrod': [0.854902,0.647059,0.125490,1.000000],
  'gray': [0.501961,0.501961,0.501961,1.000000],
  'green': [0.000000,0.501961,0.000000,1.000000],
  'greenyellow': [0.678431,1.000000,0.184314,1.000000],
  'grey': [0.501961,0.501961,0.501961,1.000000],
  'honeydew': [0.941176,1.000000,0.941176,1.000000],
  'hotpink': [1.000000,0.411765,0.705882,1.000000],
  'indianred': [0.803922,0.360784,0.360784,1.000000],
  'indigo': [0.294118,0.000000,0.509804,1.000000],
  'ivory': [1.000000,1.000000,0.941176,1.000000],
  'khaki': [0.941176,0.901961,0.549020,1.000000],
  'lavender': [0.901961,0.901961,0.980392,1.000000],
  'lavenderblush': [1.000000,0.941176,0.960784,1.000000],
  'lawngreen': [0.486275,0.988235,0.000000,1.000000],
  'lemonchiffon': [1.000000,0.980392,0.803922,1.000000],
  'lightblue': [0.678431,0.847059,0.901961,1.000000],
  'lightcoral': [0.941176,0.501961,0.501961,1.000000],
  'lightcyan': [0.878431,1.000000,1.000000,1.000000],
  'lightgoldenrodyellow': [0.980392,0.980392,0.823529,1.000000],
  'lightgray': [0.827451,0.827451,0.827451,1.000000],
  'lightgreen': [0.564706,0.933333,0.564706,1.000000],
  'lightgrey': [0.827451,0.827451,0.827451,1.000000],
  'lightpink': [1.000000,0.713725,0.756863,1.000000],
  'lightsalmon': [1.000000,0.627451,0.478431,1.000000],
  'lightseagreen': [0.125490,0.698039,0.666667,1.000000],
  'lightskyblue': [0.529412,0.807843,0.980392,1.000000],
  'lightslategray': [0.466667,0.533333,0.600000,1.000000],
  'lightslategrey': [0.466667,0.533333,0.600000,1.000000],
  'lightsteelblue': [0.690196,0.768627,0.870588,1.000000],
  'lightyellow': [1.000000,1.000000,0.878431,1.000000],
  'lime': [0.000000,1.000000,0.000000,1.000000],
  'limegreen': [0.196078,0.803922,0.196078,1.000000],
  'linen': [0.980392,0.941176,0.901961,1.000000],
  'magenta': [1.000000,0.000000,1.000000,1.000000],
  'maroon': [0.501961,0.000000,0.000000,1.000000],
  'mediumaquamarine': [0.400000,0.803922,0.666667,1.000000],
  'mediumblue': [0.000000,0.000000,0.803922,1.000000],
  'mediumorchid': [0.729412,0.333333,0.827451,1.000000],
  'mediumpurple': [0.576471,0.439216,0.858824,1.000000],
  'mediumseagreen': [0.235294,0.701961,0.443137,1.000000],
  'mediumslateblue': [0.482353,0.407843,0.933333,1.000000],
  'mediumspringgreen': [0.000000,0.980392,0.603922,1.000000],
  'mediumturquoise': [0.282353,0.819608,0.800000,1.000000],
  'mediumvioletred': [0.780392,0.082353,0.521569,1.000000],
  'midnightblue': [0.098039,0.098039,0.439216,1.000000],
  'mintcream': [0.960784,1.000000,0.980392,1.000000],
  'mistyrose': [1.000000,0.894118,0.882353,1.000000],
  'moccasin': [1.000000,0.894118,0.709804,1.000000],
  'navajowhite': [1.000000,0.870588,0.678431,1.000000],
  'navy': [0.000000,0.000000,0.501961,1.000000],
  'oldlace': [0.992157,0.960784,0.901961,1.000000],
  'olive': [0.501961,0.501961,0.000000,1.000000],
  'olivedrab': [0.419608,0.556863,0.137255,1.000000],
  'orange': [1.000000,0.647059,0.000000,1.000000],
  'orangered': [1.000000,0.270588,0.000000,1.000000],
  'orchid': [0.854902,0.439216,0.839216,1.000000],
  'palegoldenrod': [0.933333,0.909804,0.666667,1.000000],
  'palegreen': [0.596078,0.984314,0.596078,1.000000],
  'paleturquoise': [0.686275,0.933333,0.933333,1.000000],
  'palevioletred': [0.858824,0.439216,0.576471,1.000000],
  'papayawhip': [1.000000,0.937255,0.835294,1.000000],
  'peachpuff': [1.000000,0.854902,0.725490,1.000000],
  'peru': [0.803922,0.521569,0.247059,1.000000],
  'pink': [1.000000,0.752941,0.796078,1.000000],
  'plum': [0.866667,0.627451,0.866667,1.000000],
  'powderblue': [0.690196,0.878431,0.901961,1.000000],
  'purple': [0.501961,0.000000,0.501961,1.000000],
  'rebeccapurple': [0.400000,0.200000,0.600000,1.000000],
  'red': [1.000000,0.000000,0.000000,1.000000],
  'rosybrown': [0.737255,0.560784,0.560784,1.000000],
  'royalblue': [0.254902,0.411765,0.882353,1.000000],
  'saddlebrown': [0.545098,0.270588,0.074510,1.000000],
  'salmon': [0.980392,0.501961,0.447059,1.000000],
  'sandybrown': [0.956863,0.643137,0.376471,1.000000],
  'seagreen': [0.180392,0.545098,0.341176,1.000000],
  'seashell': [1.000000,0.960784,0.933333,1.000000],
  'sienna': [0.627451,0.321569,0.176471,1.000000],
  'silver': [0.752941,0.752941,0.752941,1.000000],
  'skyblue': [0.529412,0.807843,0.921569,1.000000],
  'slateblue': [0.415686,0.352941,0.803922,1.000000],
  'slategray': [0.439216,0.501961,0.564706,1.000000],
  'slategrey': [0.439216,0.501961,0.564706,1.000000],
  'snow': [1.000000,0.980392,0.980392,1.000000],
  'springgreen': [0.000000,1.000000,0.498039,1.000000],
  'steelblue': [0.274510,0.509804,0.705882,1.000000],
  'tan': [0.823529,0.705882,0.549020,1.000000],
  'teal': [0.000000,0.501961,0.501961,1.000000],
  'thistle': [0.847059,0.749020,0.847059,1.000000],
  'tomato': [1.000000,0.388235,0.278431,1.000000],
  'turquoise': [0.250980,0.878431,0.815686,1.000000],
  'violet': [0.933333,0.509804,0.933333,1.000000],
  'wheat': [0.960784,0.870588,0.701961,1.000000],
  'white': [1.000000,1.000000,1.000000,1.000000],
  'whitesmoke': [0.960784,0.960784,0.960784,1.000000],
  'yellow': [1.000000,1.000000,0.000000,1.000000],
  'yellowgreen': [0.603922,0.803922,0.196078,1.000000],
  'transparent': [0.000000,0.000000,0.000000,0.000000],
}

const numberRegex = /(-?[0-9]*\.?[0-9]+([eE][0-9]+)?)/


function parseAngleArg(arg) {
  let matches = new RegExp(numberRegex.source + (/([dD][eE][gG]|[gG][rR][aA][dD]|[rR][aA][dD]|[tT][uU][rR][nN])?$/).source).exec(arg)
  if (!matches) {
    throw "Bad Color"
  }
  let value = Number(matches[1]);
  if (!isFinite(value)) {
    throw "Bad Color"
  }
  let unit = (matches[3] || "DEG").toUpperCase();
  if (unit == "DEG") {
    return value;
  } else if (unit == "GRAD") {
    return value * 0.9;
  } else if (unit == "RAD") {
    return value * 180 / Math.PI;
  } else if (unit == "TURN") {
    return value * 360;
  } else {
    throw "Bad Color"
  }
}

function parseNumberPercentageArg(arg, opts) {
  opts.min = isFinite(opts.min) ? opts.min : NaN;
  opts.max = isFinite(opts.max) ? opts.max : 255;
  opts.percentageRequired = opts.percentageRequired || false;

  let matches = new RegExp(numberRegex.source + (/(%)?$/).source).exec(arg)
  if (!matches) {
    throw "Bad Color"
  }
  let value = Number(matches[1]);
  if (value == NaN) {
    throw "Bad Color"
  }
  if (matches[3]) {
    value = opts.max * value * .01;
  } else {
    if (opts.percentageRequired) {
      throw "Bad Color"
    }
  }
  if ((isFinite(opts.min) && value < opts.min)) {
    value = opts.min;
  } else if (value > opts.max) {
    value = opts.max;
  }
  return value
}

function parseComponentFunctionArgs(args) {
  let parsedArgs = /^\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,]+)\s*(\/\s*([^\s]+)\s*)?$/.exec(args);
  if (!parsedArgs) {
    parsedArgs = /^\s*([^\s,]+)\s*,\s*([^\s,]+)\s*,\s*([^\s,]+)\s*(,\s*([^\s]+)\s*)?$/.exec(args);
  }
  if (!parsedArgs) {
    throw "Bad Color"
  }
  return [parsedArgs[1], parsedArgs[2], parsedArgs[3], parsedArgs[5]]
}

module.exports = function cssToGlColor(cssStr) {
  if (cssStr == "" || cssStr === undefined) {
    throw "Bad Color"
  }

  cssStr = cssStr.trim().toLowerCase();

  if (cssStr.charAt(0) == "#") {
    // Hex
    let hexdigits = cssStr.substring(1);
    if (/^[a-f0-9]+$/.exec(hexdigits) == null) {
      throw "Bad Color"
    }
    if (hexdigits.length == 3) {
      return [
        parseInt(hexdigits.substring(0,1), 16) / 15,
        parseInt(hexdigits.substring(1,2), 16) / 15,
        parseInt(hexdigits.substring(2,3), 16) / 15,
        1.0
      ]
    } else if (hexdigits.length == 4) {
      return [
        parseInt(hexdigits.substring(0,1), 16) / 15,
        parseInt(hexdigits.substring(1,2), 16) / 15,
        parseInt(hexdigits.substring(2,3), 16) / 15,
        parseInt(hexdigits.substring(3,4), 16) / 15,
      ]
    } else if (hexdigits.length == 6) {
      return [
        parseInt(hexdigits.substring(0,2), 16) / 255,
        parseInt(hexdigits.substring(2,4), 16) / 255,
        parseInt(hexdigits.substring(4,6), 16) / 255,
        1.0
      ]
    } else if (hexdigits.length == 8) {
      return [
        parseInt(hexdigits.substring(0,2), 16) / 255,
        parseInt(hexdigits.substring(2,4), 16) / 255,
        parseInt(hexdigits.substring(4,6), 16) / 255,
        parseInt(hexdigits.substring(6,8), 16) / 255
      ]      
    } else {
      throw "Bad Color"
    }
  } else {
    let regExp = /\(([^)]+)\)/;
    let matches = /\s*([a-z\-]+)\(([^)]+)\)?\s*$/.exec(cssStr);
    if (matches == null) {
      // Named color
      if (cssStr in x11ColorTable) {
        return x11ColorTable[cssStr]
      } else {
        throw "Bad Color"
      }
    } else {
      // Color function
      let func = matches[1]
      let args = matches[2]
      if (func == "rgb" || func == "rgba") {
        let parsedArgs = parseComponentFunctionArgs(args)

        // Enforce either all are percentages or none are
        let isPercentage = parsedArgs.map((v)=>(v || "").includes("%"))
        if (!(isPercentage[0] == isPercentage[1] && isPercentage[1] == isPercentage[2])) {
          throw "Bad Color"
        }

        let r = parseNumberPercentageArg(parsedArgs[0], {min: 0, max: 255}) / 255
        let g = parseNumberPercentageArg(parsedArgs[1], {min: 0, max: 255}) / 255
        let b = parseNumberPercentageArg(parsedArgs[2], {min: 0, max: 255}) / 255
        let a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {min: 0, max: 1})
        return [r,g,b,a]
      } else if (func == "hsl" || func == "hsla") {
        let parsedArgs = parseComponentFunctionArgs(args)
        let h = parseAngleArg(parsedArgs[0]) % 360;
        let s = parseNumberPercentageArg(parsedArgs[1], {min: 0, max: 1, percentageRequired: true})
        let l = parseNumberPercentageArg(parsedArgs[2], {min: 0, max: 1, percentageRequired: true})
        let a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {min: 0, max: 1})
        let converted = convert.hsl.rgb(h, s*100, l*100)
        return [
          converted[0]/255, 
          converted[1]/255,
          converted[2]/255,
          a
        ]
      } else if (func == "hwb") {
        // TODO: disallow comma notation?
        let parsedArgs = parseComponentFunctionArgs(args)
        let h = parseAngleArg(parsedArgs[0]) % 360;
        let w = parseNumberPercentageArg(parsedArgs[1], {min: 0, max: 1, percentageRequired: true})
        let b = parseNumberPercentageArg(parsedArgs[2], {min: 0, max: 1, percentageRequired: true})
        let a = parseNumberPercentageArg(parsedArgs[3] || 1.0, {min: 0, max: 1})
        if (w+b > 1) {
          let ratio = w/b;
          b = 1/(1+ratio);
          w = 1 - b;
        }
        let converted = convert.hsl.rgb(h, 100, 50)
        for(var i = 0; i < 3; i++) {
          converted[i] *= (1 - w - b) / 255;
          converted[i] += w;
        }
        converted.push(a);
        return converted;
      } else if (func == "gray") {
        throw "Bad Color"
      } else if (func == "device-cmyk") {
        throw "Bad Color"
      } else {
        throw "Bad Color"
      }
    }
  }

}
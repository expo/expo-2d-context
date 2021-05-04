# expo-2d-context [![CI](https://github.com/expo/expo-2d-context/actions/workflows/ci.yml/badge.svg)](https://github.com/expo/expo-2d-context/actions/workflows/ci.yml)
A pure-JS implementation of the W3C's Canvas-2D Context API that can be run on top of either Expo Graphics or a browser WebGL context.

## Intention

This implementation is currently much slower than native 2D context implementations, and if you're interested in performance it's a better idea to create an Expo WebView and put a canvas in it.

Its primary utility is when you want to use the 2D Context API in a situation where there is no DOM and it would not be a good idea to scrounge one together.

Hopefully, it may also serve as a learning tool and alternative implementation to an API that exists mostly only in large rendering engine codebases.

## Usage

```
expo install expo-gl expo-2d-context
```

Install the node module, create a GL context by whatever mechanism your environment provides, and then pass it to a new instance of the  Expo2DContext class. After that, use said instance as you would a normal 2D context.

### Getting Things On The Screen

Unlike normal 2D context implementations, this one assumes it's drawing within a buffered environment, and thus you need to call the context's `flush()` method when you want to actually update the screen.

### Example

Create a GLView and pass it in as the constructor:

```javascript
import { GLView } from "expo-gl";
import React from "react";
import Expo2DContext from "expo-2d-context";

export default class App extends React.Component {
  render() {
    return (
      <GLView style={{ flex: 1 }} onContextCreate={this._onGLContextCreate} />
    );
  }
  _onGLContextCreate = (gl) => {
    var ctx = new Expo2DContext(gl);
    ctx.translate(50, 200);
    ctx.scale(4, 4);
    ctx.fillStyle = "grey";
    ctx.fillRect(20, 40, 100, 100);
    ctx.fillStyle = "white";
    ctx.fillRect(30, 100, 20, 30);
    ctx.fillRect(60, 100, 20, 30);
    ctx.fillRect(90, 100, 20, 30);
    ctx.beginPath();
    ctx.arc(50, 70, 18, 0, 2 * Math.PI);
    ctx.arc(90, 70, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.arc(50, 70, 8, 0, 2 * Math.PI);
    ctx.arc(90, 70, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(70, 40);
    ctx.lineTo(70, 30);
    ctx.arc(70, 20, 10, 0.5 * Math.PI, 2.5 * Math.PI);
    ctx.stroke();
    ctx.flush();
  };
}
```

Have fun!

### Browser

To build a JavaScript bundle that can be used in a browser environment, run `npm run build` in the module's root directory. This should generate a `dist/bundle.js` file that exposes all of the relevant classes and can be included in a webpage. Attach it to a WebGL context with at least 2 bits of stencil buffer:

 
```html
<html>

<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">

<script type="text/javascript" src="bundle.js"></script>

<script type="text/javascript">
    function initGL(canvas) {
        gl = canvas.getContext("webgl2", {
            stencil: 8,
        });
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }

        return gl;
    }

    function ctxStart() {
        var canvas = document.getElementById("ctxcanvas");
        var gl = initGL(canvas);

        var ctx = new Expo2DContext.default(gl);

        ctx.fillStyle = "grey";
        ctx.fillRect(20, 40, 100, 100);
        ctx.fillStyle = "white";
        ctx.fillRect(30, 100, 20, 30);
        ctx.fillRect(60, 100, 20, 30);
        ctx.fillRect(90, 100, 20, 30);
        ctx.beginPath();
        ctx.arc(50,70,18,0,2*Math.PI);
        ctx.arc(90,70,18,0,2*Math.PI);
        ctx.fill();

        ctx.fillStyle = "grey";
        ctx.beginPath();
        ctx.arc(50,70,8,0,2*Math.PI);
        ctx.arc(90,70,8,0,2*Math.PI);
        ctx.fill();

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(70,40);
        ctx.lineTo(70,30);
        ctx.arc(70,20,10,0.5*Math.PI,2.5*Math.PI);
        ctx.stroke();

        ctx.flush();
    }

</script>
</head>
<body onload="ctxStart();">
    <canvas id="ctxcanvas" width="600" height="600"></canvas>
</body>
</html>
```

### Drawing Text

To use the API's font drawing functions, first call `ctx.initializeText()`, which will load the necessary resources:

```javascript
await ctx.initializeText();
ctx.fillStyle = "blue";
ctx.font = "italic 72pt sans-serif";
ctx.fillText("Hey Galaxy", 10, 100);
ctx.flush();
``` 

#### Custom Fonts

It's possible to use your own font faces with expo-2d-context, but you have to convert them to distance-field bitmap fonts in the [Angel Code format](http://www.angelcode.com/products/bmfont/) first, likely using a tool along the lines of [Hiero](https://github.com/libgdx/libgdx/wiki/Hiero).

Once you do so, wrap the Angel Code plaintext in an instance of this repo's BMFont class, along with require() links to the actual bitmap assets. This BMFont object can be assigned to the context's font attribute. Check out this repo's [calibri.js](calibri.js) for an example.

### Parameters

The following tweakable parameters can be passed into the context's constructor:

- `maxGradStops` (default: `128`) -- The maximum number of color stops that can be added to a single gradient

- `renderWithOffscreenBuffer` (default: `false`) -- Render to an off-screen buffer, which gets flipped to the screen on `flush()`. Some platforms have bugs that prevent reading pixels directly from the screen, and in such places this must be set to true for methods like `getImageData()` to work.


## Testing and conformance

This library (mostly) complies with the Canvas 2D Context API specified at the W3C's website:

<https://www.w3.org/TR/2dcontext/>

Conformance is checked against the web platform tests here:

<https://github.com/web-platform-tests/wpt/tree/master/2dcontext>

A slightly adapted version of the above test suite is included in this repo's `test` directory, which can generate testing code for both browser and Expo environments.

### Running tests in a browser

Run `test/build_html.sh`, start an HTTP server in `test/collateral/html`, and then in a terminal run `node test/collateral/runSuite.js all`. Alternatively, you can just navigate to the HTML files directly in a web browser.

### Running tests in Expo

Run `test/build_expo.sh` and start the expo CLI in the resulting `test/collateral/expo` directory. This should spin up an app that runs all relevant conformance tests.
# expo-2d-context
A pure-js implementation of the W3C's Canvas-2D Context API that can be run on top of either Expo Graphics or a browser WebGL context.

## Intention
This implementation is currently much slower than native 2D context implementations, and if you're interested in performance it's a better idea to create an Expo WebView and put a canvas in it.

Its primary utility is when you want to use the 2D Context API  in a situation where there is no DOM and it would not be a good idea to scrounge one together.

Hopefully, it may also serve as a learning tool and alternative implementation to an API that exists mostly only in large rendering engine codebases.


### 


## Usage

Install the node module, create a GL context by whatever mechanism your environment provides, and then pass it to a new instance of the  Expo2DContext class. After that, use said instance as you would a normal 2D context.

### Getting Things On The Screen

Unlike normal 2D context implementations, this one assumes it's drawing within a buffered environment, and thus you need to call the context's `flush()` method when you want to actually update the screen.

### Expo

Create a GLView and pass it in as the constructor

```javascript
import Expo from 'expo';
import React from 'react';
import Expo2DContext from 'expo-2d-context';

class App extends React.Component {

    render() {
        return (
          <Expo.GLView
            style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        );
    }


    _onGLContextCreate = (gl) => {
        var ctx = new Expo2DContext(gl);

    }
}

Expo.registerRootComponent(App);
```

Have fun!

### Browser

To build a javascript bundle that can be used in a browser environment, run `gulp` in the module's root directory:

```
TODO
```

This should generate a `bundle.js` file that exposes all of the relevant classes and can be included in a webpage: 
 
TODO

### Drawing Text

TODO

### Parameters

TODO


## Testing and conformance

This library (mostly) complies with the Canvas 2D Context API specified at the W3C's website:

<https://www.w3.org/TR/2dcontext/>

Conformance is checked against the web platform tests here:

<https://github.com/web-platform-tests/wpt/tree/master/2dcontext>

A slightly adapted version of the above test suite is included in this repo's `test` directory, which can generate testing code for both browser and expo environments.

### Running tests in a browser

TODO 

### Running tests in Expo


TODO


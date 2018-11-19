'use strict';

import React from 'react';
import { Dimensions, Linking, NativeModules, ScrollView, Text, View } from 'react-native';
import Expo from 'expo';
import Expo2DContext from 'expo-2d-context';
import jasmineModule from 'jasmine-core/lib/jasmine-core/jasmine';
import Immutable from 'immutable';

let { ExponentTest } = NativeModules;

// List of all modules for tests. Each file path must be statically present for
// the packager to pick them all up.
function getTestModules() {
  let modules = [
    require('./2d.canvas.js'),
    require('./2d.clearRect.js'),
    require('./2d.composite.js'),
    require('./2d.coordinatespace.js'),
    require('./2d.drawImage.js'),
    require('./2d.fillRect.js'),
    require('./2d.fillStyle.js'),
    require('./2d.getcontext.js'),
    require('./2d.gradient.js'),
    require('./2d.imageData.js'),
    require('./2d.line.js'),
    require('./2d.missingargs.js'),
    require('./2d.path.js'),
    require('./2d.pattern.js'),
    require('./2d.reset.js'),
    require('./2d.scaled.js'),
    require('./2d.shadow.js'),
    require('./2d.state.js'),
    require('./2d.strokeRect.js'),
    require('./2d.strokeStyle.js'),
    require('./2d.transformation.js'),
    require('./2d.type.js'),
    require('./2d.voidreturn.js')
  ];
  return modules;
}

class App extends React.Component {
  // --- Lifecycle -------------------------------------------------------------

  constructor(props, context) {
    super(props, context);
    this.state = App.initialState;
    this._results = '';
    this._failures = '';
    this._scrollViewRef = null;
  }

  componentDidMount() {
    if (!useTestPad) {
      this._runTests(this.props.exp.initialUri);
      Linking.addEventListener('url', ({ url }) => url && this._runTests(url));
    }
  }

  // --- Test running ----------------------------------------------------------

  static initialState = {
    portalChildShouldBeVisible: false,
    testRunnerError: null,
    state: Immutable.fromJS({
      suites: [],
      path: ['suites'], // Path to current 'children' List in state
    }),
  };

  setPortalChild = testPortal => this.setState({ testPortal });
  cleanupPortal = () => new Promise(resolve => this.setState({ testPortal: null }, resolve));

  async _runTests(uri) {
    // Reset results state
    this.setState(App.initialState);

    const { jasmineEnv, jasmine } = await this._setupJasmine();

    // Load tests, confining to the ones named in the uri
    let modules = getTestModules();
    if (uri && uri.indexOf('+') > -1) {
      const deepLink = uri.substring(uri.indexOf('+') + 1);
      const filterJSON = JSON.parse(deepLink);
      if (filterJSON.includeModules) {
        console.log('Only testing these modules: ' + JSON.stringify(filterJSON.includeModules));
        const includeModulesRegexes = filterJSON.includeModules.map(m => new RegExp(m));
        modules = modules.filter(m => {
          for (let i = 0; i < includeModulesRegexes.length; i++) {
            if (includeModulesRegexes[i].test(m.name)) {
              return true;
            }
          }

          return false;
        });

        if (modules.length === 0) {
          this.setState({
            testRunnerError: `No tests were found that satisfy ${deepLink}`,
          });
          return;
        }
      }
    }
    modules.forEach(m =>
      m.test(jasmine, { setPortalChild: this.setPortalChild, cleanupPortal: this.cleanupPortal })
    );

    jasmineEnv.execute();
  }

  async _setupJasmine() {
    // Init
    jasmineModule.DEFAULT_TIMEOUT_INTERVAL = 10000;
    const jasmineCore = jasmineModule.core(jasmineModule);
    const jasmineEnv = jasmineCore.getEnv();

    // Add our custom reporters too
    jasmineEnv.addReporter(this._jasmineSetStateReporter());
    jasmineEnv.addReporter(this._jasmineConsoleReporter());

    // Get the interface and make it support `async ` by default
    const jasmine = jasmineModule.interface(jasmineCore, jasmineEnv);
    const doneIfy = fn => async done => {
      try {
        await Promise.resolve(fn());
        done();
      } catch (e) {
        done.fail(e);
      }
    };
    const oldIt = jasmine.it;
    jasmine.it = (desc, fn, t) => oldIt.apply(jasmine, [desc, doneIfy(fn), t]);
    const oldXit = jasmine.xit;
    jasmine.xit = (desc, fn, t) => oldXit.apply(jasmine, [desc, doneIfy(fn), t]);
    const oldFit = jasmine.fit;
    jasmine.fit = (desc, fn, t) => oldFit.apply(jasmine, [desc, doneIfy(fn), t]);

    return {
      jasmineCore,
      jasmineEnv,
      jasmine,
    };
  }

  // A jasmine reporter that writes results to the console
  _jasmineConsoleReporter(jasmineEnv) {
    const failedSpecs = [];

    return {
      specDone(result) {
        if (result.status === 'passed' || result.status === 'failed') {
          // Open log group if failed
          const grouping = result.status === 'passed' ? '---' : '+++';
          const emoji = result.status === 'passed' ? ':green_heart:' : ':broken_heart:';
          console.log(`${grouping} ${emoji} ${result.fullName}`);
          this._results += `${grouping} ${result.fullName}\n`;

          if (result.status === 'failed') {
            this._failures += `${grouping} ${result.fullName}\n`;
            result.failedExpectations.forEach(({ matcherName, message }) => {
              console.log(`${matcherName}: ${message}`);
              this._results += `${matcherName}: ${message}\n`;
              this._failures += `${matcherName}: ${message}\n`;
            });
            failedSpecs.push(result);
          }
        }
      },

      suiteDone(result) {},

      jasmineStarted() {
        console.log('--- tests started');
      },

      jasmineDone() {
        console.log('--- tests done');
        console.log('--- send results to runner');
        let result = JSON.stringify({
          magic: '[TEST-SUITE-END]', // NOTE: Runner/Run.js waits to see this
          failed: failedSpecs.length,
          results: this._results,
        });
        console.log(result);

        if (ExponentTest) {
          // Native logs are truncated so log just the failures for now
          ExponentTest.completed(
            JSON.stringify({
              failed: failedSpecs.length,
              failures: this._failures,
            })
          );
        }
      },
    };
  }

  // A jasmine reporter that writes results to this.state
  _jasmineSetStateReporter(jasmineEnv) {
    const app = this;
    return {
      suiteStarted(jasmineResult) {
        app.setState(({ state }) => ({
          state: state
            .updateIn(state.get('path'), children =>
              children.push(
                Immutable.fromJS({
                  result: jasmineResult,
                  children: [],
                  specs: [],
                })
              )
            )
            .update('path', path => path.push(state.getIn(path).size, 'children')),
        }));
      },

      suiteDone(jasmineResult) {
        app.setState(({ state }) => ({
          state: state
            .updateIn(
              state
                .get('path')
                .pop()
                .pop(),
              children =>
                children.update(children.size - 1, child =>
                  child.set('result', child.get('result'))
                )
            )
            .update('path', path => path.pop().pop()),
        }));
      },

      specStarted(jasmineResult) {
        app.setState(({ state }) => ({
          state: state.updateIn(
            state
              .get('path')
              .pop()
              .pop(),
            children =>
              children.update(children.size - 1, child =>
                child.update('specs', specs => specs.push(Immutable.fromJS(jasmineResult)))
              )
          ),
        }));
      },

      specDone(jasmineResult) {
        if (app.state.testPortal) {
          console.warn(
            `The test portal has not been cleaned up by \`${jasmineResult.fullName}\`. Call \`cleanupPortal\` before finishing the test.`
          );
        }

        app.setState(({ state }) => ({
          state: state.updateIn(
            state
              .get('path')
              .pop()
              .pop(),
            children =>
              children.update(children.size - 1, child =>
                child.update('specs', specs =>
                  specs.set(specs.size - 1, Immutable.fromJS(jasmineResult))
                )
              )
          ),
        }));
      },
    };
  }

  // --- Rendering -------------------------------------------------------------

  _renderSpecResult = r => {
    const status = r.get('status') || 'running';
    return (
      <View
        key={r.get('id')}
        style={{
          paddingLeft: 10,
          marginVertical: 3,
          borderColor: {
            running: '#ff0',
            passed: '#0f0',
            failed: '#f00',
            disabled: '#888',
          }[status],
          borderLeftWidth: 3,
        }}>
        <Text style={{ fontSize: 16 }}>
          {
            {
              running: '😮 ',
              passed: '😄 ',
              failed: '😞 ',
            }[status]
          }
          {r.get('description')} ({status})
        </Text>
        {r.get('failedExpectations').map((e, i) => <Text key={i}>{e.get('message')}</Text>)}
      </View>
    );
  };
  _renderSuiteResult = (r, depth) => {
    const titleStyle =
      depth == 0
        ? { marginBottom: 8, fontSize: 16, fontWeight: 'bold' }
        : { marginVertical: 8, fontSize: 16 };
    const containerStyle =
      depth == 0
        ? {
            paddingLeft: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: '#ddd',
          }
        : { paddingLeft: 16 };
    return (
      <View key={r.get('result').get('id')} style={containerStyle}>
        <Text style={titleStyle}>{r.get('result').get('description')}</Text>
        {r.get('specs').map(this._renderSpecResult)}
        {r.get('children').map(r => this._renderSuiteResult(r, depth + 1))}
      </View>
    );
  };
  _onScrollViewContentSizeChange = (contentWidth, contentHeight) => {
    if (this._scrollViewRef) {
      this._scrollViewRef.scrollTo({
        y:
          Math.max(0, contentHeight - Dimensions.get('window').height) +
          Expo.Constants.statusBarHeight,
      });
    }
  };
  _renderPortal = () => {
    const styles = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgb(255, 255, 255)',
      opacity: this.state.portalChildShouldBeVisible ? 0.5 : 0,
    };

    if (this.state.testPortal) {
      return (
        <View style={styles} pointerEvents="none">
          {this.state.testPortal}
        </View>
      );
    }
  };

  render() {
    if (useTestPad) {
      let activeContexts = 0;
      let glViews = [];
      let glContexts = [];
      let _onGLContextCreate = (gl) => {
        glContexts.push(gl);
        activeContexts += 1;
        if (activeContexts == nContexts) {
          testPad(glContexts)

        }
      };
      for(let i=0; i < nContexts; i++) {
          glViews.push(
            <Expo.GLView key={i}
              style={{ height: 300, width: 300 }}
              onContextCreate={_onGLContextCreate}/>
          )
      }
      return <View style={{flex: 1, flexDirection: 'column'}}> { glViews } </View>;
    }

    if (this.state.testRunnerError) {
      return (
        <View
          style={{
            flex: 1,
            marginTop: Expo.Constants.statusBarHeight || 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: 'red' }}>{this.state.testRunnerError}</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          marginTop: Expo.Constants.statusBarHeight || 18,
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
        testID="test_suite_container">
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            padding: 5,
          }}
          ref={ref => (this._scrollViewRef = ref)}
          onContentSizeChange={this._onScrollViewContentSizeChange}>
          {this.state.state.get('suites').map(r => this._renderSuiteResult(r, 0))}
        </ScrollView>
        {this._renderPortal()}
      </View>
    );
  }
}

/////////////////////////////////////////////////////////////////////
// Nice quick way to get an expo canvas up when debugging things,
// just set this var to true and put your test code in testPad():
var useTestPad = false;
var nContexts = 2;
import { getExpoAsset } from './assets';
function _getPixel(ctx, x,y)
{
    var imgdata = ctx.getImageData(x, y, 1, 1);
    return [ imgdata.data[0], imgdata.data[1], imgdata.data[2], imgdata.data[3] ];
}
async function testPad(glContexts) {
    var ctx = new Expo2DContext(glContexts[0], {renderWithOffscreenBuffer: true});
    var ctx2 = new Expo2DContext(glContexts[1], {renderWithOffscreenBuffer: true});


    ctx2.fillStyle = '#0f0';
    ctx2.fillRect(0, 0, 100, 50);
    ctx2.flush()
      

      let assetWidth = ctx2.gl.drawingBufferWidth;
      let assetHeight = ctx2.gl.drawingBufferHeight;
      let assetImage = ctx2.getImageData(0, 0, 10, 10);


    ctx.fillStyle = '#f00';
    ctx.drawImage(ctx2, 0, 0);
    // ctx.fillRect(30,30,15,15);

    ctx.flush()
}
//
/////////////////////////////////////////////////////////////////////

Expo.registerRootComponent(App);

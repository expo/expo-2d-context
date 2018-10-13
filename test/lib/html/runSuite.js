#!/usr/bin/env node
var ArgumentParser = require('argparse').ArgumentParser;
const puppeteer = require('puppeteer');

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error.message);
});

var suiteResults = {}

var runTestSuite = async (suite_name, suite_url) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  let allTestResults = []

  await page.exposeFunction('testComplete', (testResults, testsRun, testsLength) => {
    if (testResults.failureMessages.length > 0) {
      console.error("  FAILURE: Test "+testResults.name)
      for (let errIdx = 0; errIdx < testResults.failureMessages.length; errIdx++) {
        console.error("    "+testResults.failureMessages[errIdx])
      }
      testId = testResults.id
      console.error("  Solo run: " + suite_url + "?runTests=" + testId + "&noCleanup#" + testId)
    }
    allTestResults.push(testResults)
    console.log("Tests run: " + testsRun + " / " + testsLength)
  });

  await page.goto(suite_url, {waitUntil: 'networkidle2'});
  await page.waitForFunction('document.getElementById("suite_status").className != "progress"');

  let success = (await page.evaluate('document.getElementById("suite_status").className')) == "success"

  let failureInspectionURL = suite_url + "?noCleanup&runTests="
  let failedTests = []
  for (let testIdx = 0; testIdx < allTestResults.length; testIdx++) {
    let testResults = allTestResults[testIdx];
    if (testResults.failureMessages.length > 0) {
      failureInspectionURL += testResults.id + ",";
      failedTests.push(testResults);
    }
  }
  if (failedTests.length == 0) {
    failureInspectionURL = null;
  } 

  suiteResults[suite_name] = {
    "name": suite_name,
    "succeeded": success,
    "failureInspectionURL": failureInspectionURL,
    "failedTests": failedTests,
    // "allTests": allTestResults // this muddles simple printing and doesn't seem useful
  }

  await browser.close();

};


(async () => {

  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'expo-2d-context test suite runner'
  });
  parser.addArgument(
    [ '--base-url' ],
    {
      help: 'Base URL to load test suites from',
      defaultValue: 'http://127.0.0.1:8081/'
    }
  );
  parser.addArgument(
    [ 'suite' ],
    {
      nargs: '+',
      help: 'Name of suite(s) to run',
      defaultValue: 'http://127.0.0.1:8081/'
    }
  );
  var args = parser.parseArgs();  

  for (var i=0; i<args["suite"].length; i++) {
    try {
      let suite_url = args["base_url"]+args["suite"][i]+".html"
      console.log("Launching suite "+args["suite"][i]+" ("+suite_url+")")
      await runTestSuite(args["suite"][i], suite_url);
    } catch (error) {
      console.error(error);
    }
    console.log("~~")
  }
  let succeededSuites = Object.keys(suiteResults).filter(key => suiteResults[key]["succeeded"]==true)
  let failedSuites = Object.keys(suiteResults).filter(key => suiteResults[key]["succeeded"]==false)
  console.log("Succeeded: " + succeededSuites)
  console.log("Failed: " + failedSuites)
  for (let suiteIdx = 0; suiteIdx < failedSuites.length; suiteIdx++) {
    let failedSuite = suiteResults[failedSuites[suiteIdx]] 
    console.log(failedSuite)
  }
})();


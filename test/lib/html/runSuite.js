#!/usr/bin/env node
const puppeteer = require('puppeteer');
const suite_base_url = "http://localhost:8000/"

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error.message);
});

var suites = process.argv.slice(2)

var suiteResults = {}

var runTestSuite = async (suite_name) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  const suite_url = suite_base_url+suite_name+".html"

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
  for (var i=0; i<suites.length; i++) {
    console.log("Launching suite "+suites[i])
    try {
      await runTestSuite(suites[i]);
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


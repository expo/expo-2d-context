#!/usr/bin/env node
var ArgumentParser = require('argparse').ArgumentParser;
var fs = require('fs');
const puppeteer = require('puppeteer');

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error.message);
});

var suiteResults = {}

var runTestSuite = async (suite) => {
  const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]})
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
      console.error("  Solo run: " + suite.href + "?runTests=" + testId + "&noCleanup#" + testId)
    }
    allTestResults.push(testResults)
    console.log("Tests run: " + testsRun + " / " + testsLength)
  });

  await page.goto(suite.href, {timeout: 240000, waitUntil: 'networkidle2'});
  await page.waitForFunction('document.getElementById("suite_status").className != "progress"');

  let success = (await page.evaluate('document.getElementById("suite_status").className')) == "success"

  let failureInspectionURL = suite.href + "?noCleanup&runTests="
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

  await browser.close();

  return {
    "name": suite.name,
    "succeeded": success,
    "failureInspectionURL": failureInspectionURL,
    "failedTests": failedTests,
    // "allTests": allTestResults // this muddles simple printing and doesn't seem useful
  }

};

var getSubsuites = async (suite_url) => {
  const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]})
  const page = await browser.newPage();
  await page.goto(suite_url, {waitUntil: 'networkidle2'});

  const test_list = await page.evaluate(() => {
    const anchors = Array.from(document.getElementsByTagName("a"));
    return anchors.map(anchor => {
      const title = anchor.dataset.name;
      return {"href": anchor.href, "name": anchor.dataset.name, "count": anchor.dataset.count}
    });
  });

  var test_map = {}
  for (var i=0; i < test_list.length; i++) {
    test_map[test_list[i].name] = test_list[i]
  }

  await browser.close();

  return test_map
}

(async () => {



  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'expo-2d-context test suite runner'
  });

  defaultResultsFile="results.json"
  parser.addArgument(
    [ '--resultsFile' ],
    {
      help: "Filename to output results to [default: "+defaultResultsFile+"]",
      defaultValue: defaultResultsFile
    }
  );

  defaultResultsFormat="basic"
  parser.addArgument(
    [ '--resultsFormat' ],
    {
      help: "Format of result output {basic, TBD} [default: "+defaultResultsFormat+"]",
      defaultValue: defaultResultsFormat
    }
  );

  parser.addArgument(
    [ '--quiet' ],
    {
      help: "Don't print human-readable progress information to stdout/stderr",
      action: "storeTrue"
    }
  );

  let defaultUrl = "http://127.0.0.1:8081/"
  parser.addArgument(
    [ '--base-url' ],
    {
      help: 'Base URL to load test suites from [default:'+defaultUrl+']',
      defaultValue: defaultUrl
    }
  );

  parser.addArgument(
    [ 'suite' ],
    {
      nargs: '*',
      help: 'Name of suite(s) to run, "all" to run all, or not specified, to list available suites)',
      defaultValue: []
    }
  );
  var args = parser.parseArgs();  


  if (args.quiet) {
    console.log = (val) => {}
    console.error = (val) => {}
  }
  console.log("Loading test harness at "+args["base_url"])
  var subsuites = await getSubsuites(args["base_url"]);
  if (args["suite"].length == 1 && args["suite"][0] == "all") {
    args["suite"] = Object.keys(subsuites)
  }
  if (args["suite"].length == 0){
    console.log(subsuites)
  } else {

    let notRunSuites = []
    for (var i=0; i<args["suite"].length; i++) {
      if (args["suite"][i] in subsuites) {
        let subsuite = subsuites[args["suite"][i]]
        console.log("Launching suite "+subsuite.name+" ("+subsuite.href+")")
        try {
          suiteResults[subsuite.name] = await runTestSuite(subsuite);
        } catch (error) {
          suiteResults[subsuite.name] = {
            "name": subsuite.name,
            "succeeded": false,
            "exception": error
          }
          console.error(error);
        }
      } else {
        console.log("WARNING: suite " + args["suite"][i] + " not found")
        notRunSuites.push(args["suite"][i])
      }
      console.log("~~")
    }
    let succeededSuites = Object.keys(suiteResults).filter(key => suiteResults[key]["succeeded"]==true)
    let failedSuites = Object.keys(suiteResults).filter(key => suiteResults[key]["succeeded"]==false)
    
    let basicSummary = {
      "succeeded": succeededSuites,
      "failed": failedSuites,
      "notRun": notRunSuites
    }
    let basicFailureDetail = {}
    for (let suiteIdx = 0; suiteIdx < failedSuites.length; suiteIdx++) {
      let failedSuite = suiteResults[failedSuites[suiteIdx]] 
      basicFailureDetail[failedSuites[suiteIdx]] = failedSuite
    }
    let basicResults = {
        "summary": basicSummary,
        "detail": basicFailureDetail
    }

    console.log(JSON.stringify(basicResults, null, 2))

    if (args.resultsFormat == "basic") {
      let err = fs.writeFileSync(args.resultsFile, JSON.stringify(basicResults, null, 2))
      if (err) {
        console.error(err);
      }
    } else {
      console.error("Bad output format specified")
    }

  }

  process.exit(0)
})();


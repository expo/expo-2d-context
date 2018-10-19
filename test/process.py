#!/usr/bin/env python
# Return a status code to the shell based on whether or not a results.json file
# contains failed test suites
import sys
import json

if __name__ == "__main__":
    with open(sys.argv[1], "r") as f:
        results = json.load(f)
        exit(len(results["summary"]["failed"]) > 0)
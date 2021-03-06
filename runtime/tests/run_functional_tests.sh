#!/usr/bin/env bash

LOGFILE=$(pwd)/functional_tests.log
BROWSERLOGS=$(pwd)/browser_logs.log
echo Using logfile $LOGFILE and $BROWSERLOGS

# For the functional tests, we are mocking the core
export NODE_ENV=inmemory

# Start selenium server just for this test run
echo -n Starting Webdriver and Selenium...
(webdriver-manager start --versions.chrome 2.24 >>$LOGFILE 2>&1 &)
# Wait for port 4444 to be listening connections
while ! (ncat -w 1 127.0.0.1 4444 </dev/null >/dev/null 2>&1); do sleep 1; done
echo done.

# Start the web app
echo -n Starting Planner development server...
(node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --host 0.0.0.0 --port 8088 >>$LOGFILE 2>&1 &)
# Wait for port 8088 to be listening connections
while ! (ncat -w 1 127.0.0.1 8088 </dev/null >/dev/null 2>&1); do sleep 1; done
echo done.

# Retrieve index.html to trigger webpack to build the source
echo -n Building source...
# Wait for the build to finish (index.html is delivered)
curl http://localhost:8088/ -o /dev/null -s
echo done.

# Finally run protractor
echo Running tests...
if [ -z "$1" ]
  then
# Shouldn't we have the path appended with tests? e.g. tests/protractor.config.js
    node_modules/protractor/bin/protractor protractor.config.js 2>&1 | tee -a $BROWSERLOGS
else
    node_modules/protractor/bin/protractor protractor.config.js --suite $1 2>&1 | tee -a $BROWSERLOGS
fi
TEST_RESULT=$?

# Cleanup webdriver-manager and web app processes
fuser -k -n tcp 4444
fuser -k -n tcp 8088

# Return test result
if [ $TEST_RESULT -eq 0 ]; then
  echo 'Functional tests OK'
  exit 0
else
  echo 'Functional tests FAIL'
  exit 1
fi

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 80000,
  resultJsonOutputFile: './e2e/test_results/results.json',
  specs: [
    './src/register/*.e2e-spec.ts'
     //'./src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    // chromeOptions:  { args: [ "--no-sandbox", "--headless", "--disable-gpu", "--window-size=800,600"] }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },

   
  
};
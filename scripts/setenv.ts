const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const baseUrlProd = "https://stagingbackend.psirs.gov.ng/";
const baseUrlDev = "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/";
const baseUrlLocal = "http://localhost:5001/";
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   API_BASE_URL_LOCAL: "${process.env.API_BASE_URL_LOCAL || baseUrlLocal}",
   API_BASE_URL_PROD: "${process.env.API_BASE_URL_PROD || baseUrlProd}",
   API_BASE_URL_DEV: "${process.env.API_BASE_URL_DEV || baseUrlDev}"
};`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log("Error writting environment file", err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});
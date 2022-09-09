//this handles deployment routing which is down in stages 
//which can be locally, staging, production, developers
export const environment = {
   production: true,
   API_BASE_URL_LOCAL: "http://psirs-portal-original.test/",
   API_BASE_URL_PROD: "https://stagingbackend.psirs.gov.ng/",
   API_BASE_URL_STAGING: "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/",
   API_BASE_URL_DEV: "http://psirs-dev-server.eu-west-2.elasticbeanstalk.com/",
};
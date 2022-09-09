//this handles deployment routing which is down in stages 
export const environment = {
   production: false,
   API_BASE_URL_LOCAL: "http://localhost:5001/",
   API_BASE_URL_PROD: "https://stagingbackend.psirs.gov.ng/",
   API_BASE_URL_DEV: "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/"
};
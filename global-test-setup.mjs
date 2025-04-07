/**
 * This file is used to mock the environment variables that are required for the tests.
 */
export default async function () {
  const aiCoreServiceCredentials = {
    clientid: 'clientid',
    clientsecret: 'clientsecret',
    url: 'https://example.authentication.eu12.hana.ondemand.com',
    serviceurls: {
      AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
    }
  };
  process.env['AICORE_SERVICE_KEY'] = JSON.stringify(aiCoreServiceCredentials);
};

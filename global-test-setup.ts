/**
 * This file is used to mock the environment variables that are required for the tests.
 */
export default async function mockAiCoreEnvVariable(): Promise<void> {
    const aiCoreServiceCredentials =  {
        clientid: 'clientid',
        clientsecret: 'clientsecret',
        url: 'https://example.authentication.eu12.hana.ondemand.com',
        serviceurls: {
          AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
        }
      };
    process.env['aicore'] = JSON.stringify(aiCoreServiceCredentials);
}

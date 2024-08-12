export default async function mockAiCoreEnvVariable() {
    const aiCoreServiceCredentials =  {
        clientid: 'clientid',
        clientsecret: 'clientsecret',
        url: 'https://example.authentication.eu12.hana.ondemand.com',
        serviceurls: {
          AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
        }
      }
    process.env['aicore'] = JSON.stringify(aiCoreServiceCredentials);
}

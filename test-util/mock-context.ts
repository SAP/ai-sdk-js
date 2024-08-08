import {
  DestinationAuthToken,
  HttpDestination,
  ServiceCredentials
} from '@sap-cloud-sdk/connectivity';
import nock from 'nock';

export const aiCoreServiceBinding = {
  label: 'aicore',
  credentials: {
    clientid: 'clientid',
    clientsecret: 'clientsecret',
    url: 'https://example.authentication.eu12.hana.ondemand.com',
    identityzone: 'examplezone',
    identityzoneid: 'examplezoneid',
    appname: 'appname',
    serviceurls: {
      AI_API_URL: 'https://api.ai.ml.hana.ondemand.com'
    }
  }
};

export const aiCoreDestination = {
  url: 'https://api.ai.ml.hana.ondemand.com'
};

export function createDestinationTokens(
  token: string = 'mock-token',
  expiresIn?: string
): { authTokens: DestinationAuthToken[] } {
  return {
    authTokens: [
      {
        value: token,
        type: 'bearer',
        expiresIn,
        http_header: { key: 'Authorization', value: `Bearer ${token}` },
        error: null
      }
    ]
  };
}

export function mockAiCoreEnvVariable(): void {
  process.env['aicore'] = JSON.stringify(aiCoreServiceBinding.credentials);
}

/**
 * @internal
 */
export function mockGetAiCoreDestination(
  destination = aiCoreDestination
): HttpDestination {
  const mockDestination: HttpDestination = {
    ...destination,
    authentication: 'OAuth2ClientCredentials',
    ...createDestinationTokens()
  };
  return mockDestination;
}

export function mockClientCredentialsGrantCall(
  response: any,
  responseCode: number,
  serviceCredentials: ServiceCredentials = aiCoreServiceBinding.credentials,
  delay = 0
): nock.Scope {
  return nock(serviceCredentials.url, {
    reqheaders: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  })
    .post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: serviceCredentials.clientid,
      client_secret: serviceCredentials.clientsecret,
      response_type: 'token'
    })
    .delay(delay)
    .reply(responseCode, response);
}

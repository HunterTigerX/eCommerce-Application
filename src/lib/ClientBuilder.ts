// import fetch from 'node-fetch'
import {
  ClientBuilder,
  Client,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2'
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from '@commercetools/platform-sdk'
const scopes = ['manage_project:ecommerce-tools', 'manage_api_clients:ecommerce-tools', 'view_audit_log:ecommerce-tools'];

process.env.CTP_AUTH = 'https://auth.europe-west1.gcp.commercetools.com';
process.env.CTP_API = 'https://api.europe-west1.gcp.commercetools.com';
process.env.CTP_CLIENT_ID = '5tTOcryqEc0260UBCixdgSxM';
process.env.CTP_CLIENT_SECRET = 'SIAJIycjtxb-ldLcU9e-6uEapfVrPJmo';
process.env.CTP_PROJECT_KEY = 'ecommerce-tools';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH,
  projectKey: process.env.CTP_PROJECT_KEY,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID,
    clientSecret: process.env.CTP_CLIENT_SECRET,
  },
  scopes: scopes,
  fetch,
}

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
}

const client: Client = new ClientBuilder()
  .withProjectKey(process.env.CTP_PROJECT_KEY)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build()

export const getApiRoot: () => ApiRoot = () => {
  return createApiBuilderFromCtpClient(client)
}

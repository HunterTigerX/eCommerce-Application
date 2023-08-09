import { LOClass } from '../LoginOptions.tsx';
import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';

const clientAuthMiddlewareOptions = LOClass.withClientCredentialsFlow();
const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();
const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

// Описание лежит в ../LoginOptions
export function withCredentialsFlow(): Client {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withClientCredentialsFlow(clientAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
}

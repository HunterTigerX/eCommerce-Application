import { LOClass } from '../LoginClasses.tsx';
import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';


const clientAuthMiddlewareOptions = LOClass.withClientCredentialsFlow();
const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();
const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

export function withCredentialsFlow(): Client {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withClientCredentialsFlow(clientAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
}

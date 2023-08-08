import { LOClass } from '../LoginClasses.tsx';
import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';

const {  VITE_PROJECT_KEY: projectKey} = import.meta.env;

export function withExistingToken(): Client {
  const clientExistingTokenFlow = LOClass.withExistingTokenFlow(true);
  const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

  const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withExistingTokenFlow(clientExistingTokenFlow.authorization, clientExistingTokenFlow.options)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

  return client
}

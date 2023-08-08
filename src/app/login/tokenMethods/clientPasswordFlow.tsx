import { LOClass } from '../LoginClasses.tsx';
import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';

export function withPasswordFlow(username: string, password: string): Client {
  const clientAuthPasswordFlow = LOClass.withPasswordFlow(username, password);
  const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

  const client = new ClientBuilder()
    .withPasswordFlow(clientAuthPasswordFlow)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
}

import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';
import { LOClass } from '../LoginOptionsClass.tsx';

const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

/*
At first sight, creating a new token with a new anonymous session on the first request is the most straight forward implementation. However, this pattern results in a very high number of unused anonymous sessions, for example if a stateless web crawler acts like a new visitor on every request or if visitors drop off after only browsing the site.
To avoid creating unused anonymous sessions, hold a visitor-independent client credentials flow token (for example with only the view_published_products scope) and only request a token with an anonymous session when the visitor creates a cart, shopping list or other visitor-specific resource. A single API Client can be used to create both types of tokens.
anonymousId генерируется автоматически или устанавливается вручную
*/

class NewClientClass {
  withCredentialsFlow(): Client {
    const clientAuthMiddlewareOptions = LOClass.withClientCredentialsFlow();
    const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();
    const client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(clientAuthMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
    return client;
  }

  withAnonymousSession(anonymousId?: string): Client {
    const clientAuthAnonFlow = LOClass.withAnonymousSessionFlow(anonymousId);
    const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

    const client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withAnonymousSessionFlow(clientAuthAnonFlow)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
    return client;
  }

  withExistingToken(): Client {
    const clientExistingTokenFlow = LOClass.withExistingTokenFlow(true);
    const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

    const client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withExistingTokenFlow(clientExistingTokenFlow.authorization, clientExistingTokenFlow.options)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
    return client;
  }

  withPasswordFlow(username: string, password: string): Client {
    const clientAuthPasswordFlow = LOClass.withPasswordFlow(username, password);
    const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

    const client = new ClientBuilder()
      .withPasswordFlow(clientAuthPasswordFlow)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build();
    return client;
  }
}

export const NewClient = new NewClientClass();

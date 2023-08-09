import { ClientBuilder, Client } from '@commercetools/sdk-client-v2';
import { LOClass } from '../LoginOptionsClass.tsx';
const { VITE_PROJECT_KEY: projectKey } = import.meta.env;

// anonymousId генерируется автоматически или устанавливается вручную
export function withRefreshToken(refreshToken: string): Client {
  const clientAuthAnonFlow = LOClass.withRefreshTokenFlow(refreshToken);
  const httpMiddlewareOptions = LOClass.HttpMiddlewareOptions();

  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withRefreshTokenFlow(clientAuthAnonFlow)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return client;
}

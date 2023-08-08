import {
  AuthMiddlewareOptions,
  Credentials,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  UserAuthOptions,
  AnonymousAuthMiddlewareOptions,
  ExistingTokenMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { fetcher } from './fetcher.tsx';

const {
  VITE_CLIENT_ID: clientId,
  VITE_CLIENT_SECRET: clientSecret,
  VITE_PROJECT_ADMIN_SCOPE: adminScope,
  VITE_PROJECT_KEY: projectKey,
  VITE_AUTH: host,
  VITE_API: api,
} = import.meta.env;

interface ExistingTokenMiddlewareOptionsToken {
  authorization: string;
  options: ExistingTokenMiddlewareOptions;
}

export class LoginOptions {
  withClientCredentialsFlow = (): AuthMiddlewareOptions => {
    const credentials: Credentials = { clientId, clientSecret };
    const scopes = adminScope.split(',');
    const options: AuthMiddlewareOptions = { host, projectKey, credentials, scopes, fetch: fetcher };
    return options;
  };

  withPasswordFlow(username: string, password: string): PasswordAuthMiddlewareOptions {
    const user: UserAuthOptions = { username, password };
    const credentials = { clientId, clientSecret, user };
    const scopes = adminScope.split(',');
    const options: PasswordAuthMiddlewareOptions = { host, projectKey, credentials, scopes, fetch: fetcher };
    return options;
  }

  withAnonymousSessionFlow(anonymousId?: string): AnonymousAuthMiddlewareOptions {
    const credentials = { clientId, clientSecret, anonymousId };
    const scopes = adminScope.split(',');
    // For new API we will need to add create_anonymous_token scope
    const options: AnonymousAuthMiddlewareOptions = { host, projectKey, credentials, scopes, fetch: fetcher };
    return options;
  }

  withRefreshTokenFlow(refreshToken: string): RefreshAuthMiddlewareOptions {
    const credentials = { clientId, clientSecret };
    const options: RefreshAuthMiddlewareOptions = { host, projectKey, credentials, refreshToken, fetch: fetcher };
    return options;
  }

  withExistingTokenFlow(isForced: boolean): ExistingTokenMiddlewareOptionsToken {
    const options: ExistingTokenMiddlewareOptions = { force: isForced };
    const tokenStorage = localStorage.getItem('access_token');
    const authorization = tokenStorage ? tokenStorage : '';
    const params = { authorization, options };
    return params;
  }

  HttpMiddlewareOptions(): HttpMiddlewareOptions {
    const options: HttpMiddlewareOptions = { host: api, fetch };
    return options;
  }
}
// Сделать скоупы для пользователей

export const LOClass = new LoginOptions();
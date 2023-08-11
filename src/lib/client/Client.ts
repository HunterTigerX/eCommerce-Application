import { ClientBuilder, type Client } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient, Customer } from '@commercetools/platform-sdk';
import { MiddlewareAuthOptions } from './MiddlewareAuthOptions';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export class ApiClient {
  private readonly options: MiddlewareAuthOptions;

  private client: Client;

  constructor() {
    this.options = new MiddlewareAuthOptions();
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(this.options.getClientCredentialAuthOptions())
      .withHttpMiddleware(this.options.getHttpAuthOptions())
      .build();
  }

  public get requestBuilder() {
    return createApiBuilderFromCtpClient(this.client).withProjectKey({ projectKey });
  }

  public async init(): Promise<Customer | null> {
    const token = localStorage.getItem('access_token');

    if (token) {
      this.switchToExistingTokenFlow(token);

      return new Promise((resolve) => {
        this.requestBuilder
          .me()
          .get()
          .execute()
          .then((res) => {
            resolve(res.body);
          });
      });
    }

    return null;
  }

  public switchToExistingTokenFlow(token: string): void {
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withExistingTokenFlow(`Bearer ${token}`, { force: true })
      .withHttpMiddleware(this.options.getHttpAuthOptions())
      .build();
  }

  public switchToPasswordFlow(user: { username: string; password: string }): void {
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withPasswordFlow(this.options.getPasswordAuthOptions(user))
      .withHttpMiddleware(this.options.getHttpAuthOptions())
      .build();
  }

  // switch to client credentials?
  public switchToAnonymousFlow(): void {
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withAnonymousSessionFlow(this.options.getAnonymousAuthOptions(`${Date.now()}`))
      .withHttpMiddleware(this.options.getHttpAuthOptions())
      .build();
  }
}

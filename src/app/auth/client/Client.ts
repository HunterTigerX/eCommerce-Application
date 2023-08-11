import { ClientBuilder, type Client } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient, Customer } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { AuthOptions } from './AuthOptions';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export class ApiClient {
  private readonly authOptions: AuthOptions;

  private client: Client;

  constructor() {
    this.authOptions = new AuthOptions();
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withClientCredentialsFlow(this.authOptions.getClientCredentialOptions())
      .withHttpMiddleware(this.authOptions.getHttpOptions())
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
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();
  }

  public switchToPasswordFlow(user: UserAuthOptions): void {
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withPasswordFlow(this.authOptions.getPasswordOptions(user))
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();
  }

  // switch to client credentials?
  public switchToAnonymousFlow(): void {
    this.client = new ClientBuilder()
      .withProjectKey(projectKey)
      .withAnonymousSessionFlow(this.authOptions.getAnonymousOptions(`${Date.now()}`))
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();
  }
}

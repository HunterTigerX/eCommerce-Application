import { Customer } from '@commercetools/platform-sdk';
import { ApiClient } from '@lib';

export class User {
  private apiClient: ApiClient;

  public data: Customer | null = null;

  constructor() {
    this.apiClient = new ApiClient();
  }

  public async init(): Promise<void> {
    this.data = await this.apiClient.init();
  }

  public async signIn(user: { username: string; password: string }): Promise<Customer> {
    this.apiClient.switchToPasswordFlow(user);

    return new Promise((resolve) => {
      this.apiClient.requestBuilder
        .me()
        .get()
        .execute()
        .then((res) => {
          this.data = res.body;
          resolve(this.data);
        });
    });
  }

  public async signUp({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<Customer> {
    return new Promise((resolve) => {
      this.apiClient.requestBuilder
        .me()
        .signup()
        .post({
          body: {
            firstName,
            lastName,
            email,
            password,
          },
        })
        .execute()
        .then(() => {
          // нужно сделать какой-то запрос через этот флоу, чтобы получить токен, иначе будет 403
          this.apiClient.switchToPasswordFlow({ username: email, password });

          this.apiClient.requestBuilder
            .me()
            .get()
            .execute()
            .then((res) => {
              this.data = res.body;
              resolve(this.data);
            });
        })
        .catch(() => localStorage.removeItem('access_token'));
    });
  }

  public async signOut(): Promise<void> {
    const token = localStorage.getItem('access_token');

    if (token) {
      fetch(`${import.meta.env.VITE_CTP_AUTH_URL}/oauth/token/revoke`, {
        method: 'POST',
        body: `token=${token}&token_type_hint=access_token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            `${import.meta.env.VITE_CTP_CLIENT_ID}:${import.meta.env.VITE_CTP_CLIENT_SECRET}`
          )}`,
        },
      }).finally(() => {
        localStorage.clear();
        this.data = null;
        this.apiClient.switchToAnonymousFlow();
      });
    }
  }
}

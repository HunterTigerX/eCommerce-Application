import type { Customer, MyCustomerDraft } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { ApiClient } from '@app/auth/client';

export type AuthResponse = { success: true; data: Customer } | { success: false; message: string };

export class AuthService {
  private client: ApiClient;

  public user: Customer | null = null;

  constructor() {
    this.client = new ApiClient();
  }

  public async init(): Promise<void> {
    this.user = await this.client.init();
  }

  public async signIn(credentials: UserAuthOptions): Promise<AuthResponse> {
    try {
      this.client.switchToPasswordClient(credentials);

      const response = await this.client.requestBuilder.me().get().execute();

      this.user = response.body;

      return {
        success: true,
        data: this.user,
      };
    } catch (error: unknown) {
      this.client.switchToDefaultClient();

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to Sign In',
      };
    }
  }

  public async signUp(credentials: MyCustomerDraft): Promise<AuthResponse> {
    try {
      await this.client.requestBuilder
        .me()
        .signup()
        .post({
          body: credentials,
        })
        .execute();

      this.client.switchToPasswordClient({ username: credentials.email, password: credentials.password });

      const signInResponse = await this.client.requestBuilder.me().get().execute();

      this.user = signInResponse.body;

      return {
        success: true,
        data: this.user,
      };
    } catch (error: unknown) {
      this.client.switchToDefaultClient();

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to Sign Up',
      };
    }
  }

  public async signOut(): Promise<void> {
    const token = localStorage.getItem('access_token');

    if (token) {
      const {
        VITE_CTP_AUTH_URL: authUrl,
        VITE_CTP_CLIENT_SECRET: clientSecret,
        VITE_CTP_CLIENT_ID: clientId,
      } = import.meta.env;

      try {
        await fetch(`${authUrl}/oauth/token/revoke`, {
          method: 'POST',
          body: `token=${token}&token_type_hint=access_token`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
        });
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }

      localStorage.removeItem('access_token');
    }

    this.client.switchToDefaultClient();
    this.user = null;
  }
}

import type { Customer, MyCustomerDraft } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { ApiClient } from '@app/auth/client';

export type AuthResponse = { success: true; data: Customer } | { success: false; message: string };

export class AuthService {
  private apiClient: ApiClient;

  public user: Customer | null = null;

  constructor() {
    this.apiClient = new ApiClient();
  }

  public async init(): Promise<void> {
    this.user = await this.apiClient.init();
  }

  public async signIn(credentials: UserAuthOptions): Promise<AuthResponse> {
    // return to default/anon on fail?
    this.apiClient.switchToPasswordFlow(credentials);

    try {
      const response = await this.apiClient.requestBuilder.me().get().execute();
      this.user = response.body;
      return {
        success: true,
        data: this.user,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to Sign In',
      };
    }
  }

  public async signUp(credentials: MyCustomerDraft): Promise<AuthResponse> {
    try {
      await this.apiClient.requestBuilder
        .me()
        .signup()
        .post({
          body: credentials,
        })
        .execute();

      // need to make request through this flow to get a new access token, otherwise it will fail with 403 status code
      this.apiClient.switchToPasswordFlow({ username: credentials.email, password: credentials.password });

      const signInResponse = await this.apiClient.requestBuilder.me().get().execute();

      this.user = signInResponse.body;

      return {
        success: true,
        data: this.user,
      };
    } catch (error: unknown) {
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

    this.apiClient.switchToAnonymousFlow();
    this.user = null;
  }
}

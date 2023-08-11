import type { Customer } from '@commercetools/platform-sdk';

export type AuthResponse = { success: true; data: Customer } | { success: false; message: string };

export interface UserSignInCredentials {
  username: string;
  password: string;
}

export interface UserSignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

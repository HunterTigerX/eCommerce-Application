import type { Cart } from '@commercetools/platform-sdk';
import { ApiClient } from '@shared/api/core';

export type CartResponse = { success: true; data: Cart } | { success: false; message: string };

export class CartService {
  public cart: Cart | undefined;

  public AllCarts: Cart | undefined;

  private async createCart(): Promise<string> {
    const result = await ApiClient.getInstance()
      .requestBuilder.me()
      .carts()
      .post({
        body: {
          currency: 'EUR',
        },
      })
      .execute()
      .then((response) => {
        this.cart = response.body;
        return 'success';
      });
    return result === 'success' ? 'success' : 'error';
  }

  public async init(): Promise<void> {
    await ApiClient.getInstance()
      .requestBuilder.me()
      .activeCart()
      .get()
      .execute()
      .then((response) => {
        this.cart = response.body;
      })
      .catch(async () => {
        await this.createCart();
      });
  }

  public async getCart(): Promise<CartResponse> {
    try {
      const response = await ApiClient.getInstance().requestBuilder.me().activeCart().get().execute();
      this.cart = response.body;
      console.log('this.cartExisted', this.cart);
      return {
        success: true,
        data: response.body,
      };
    } catch (error: unknown) {
      await this.init();
      console.log('this.cartDidNotExist', this.cart);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retreive cart',
      };
    }
  }

  public async clearCart(): Promise<CartResponse> {
    await this.init();
    if (this.cart)
      await ApiClient.getInstance()
        .requestBuilder.me()
        .carts()
        .withId({
          ID: this.cart.id,
        })
        .delete({
          queryArgs: {
            version: this.cart.version,
          },
        })
        .execute();
    await this.createCart();
    return this.getCart();
  }
}

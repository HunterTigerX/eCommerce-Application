import { createContext, type ReactNode, useState } from 'react';
import type { Cart } from '@commercetools/platform-sdk';
import { CartService, type CartResponse } from './CartService';

const cartService = new CartService();
await cartService.init();

interface CartProviderValue {
  cart: Cart | undefined;
  getCart: () => Promise<CartResponse>;
  updateCart: (newCart: Cart) => void;
  clearCart: () => Promise<CartResponse>;
  reloadCart: () => Promise<void>;
  has: (id: string) => boolean;
  count: () => number;
}

const CartContext = createContext<CartProviderValue>({
  cart: cartService.cart,
  getCart: () => Promise.resolve({ success: false, message: '' }),
  updateCart: () => Promise.resolve({ success: false, message: '' }),
  clearCart: () => Promise.resolve({ success: false, message: '' }),
  reloadCart: () => Promise.resolve(),
  has: () => false,
  count: () => 0,
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | undefined>(cartService.cart);

  const getCart = async (): Promise<CartResponse> => {
    const result: CartResponse = await cartService.getCart();
    if (result.success) setCart(result.data);
    return result;
  };

  const updateCart = (newCart: Cart): void => {
    setCart(newCart);
  };

  const clearCart = async (): Promise<CartResponse> => {
    const result: CartResponse = await cartService.clearCart();
    if (result.success) setCart(result.data);
    return result;
  };

  const reloadCart = async (): Promise<void> => {
    cartService.init();
  };

  const has = (id: string) => {
    if (cart) {
      const item = cart.lineItems.find((lineItem) => lineItem.productId === id);

      return !!item;
    }

    return false;
  };

  const count = () => {
    if (cart) {
      return cart.lineItems.length;
    }

    return 0;
  };

  const value: CartProviderValue = {
    cart: cart,
    getCart,
    updateCart,
    clearCart,
    reloadCart,
    has,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };

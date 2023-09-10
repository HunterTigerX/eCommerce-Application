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
}

const CartContext = createContext<CartProviderValue>({
  cart: cartService.cart,
  getCart: () => Promise.resolve({ success: false, message: '' }),
  updateCart: () => Promise.resolve({ success: false, message: '' }),
  clearCart: () => Promise.resolve({ success: false, message: '' }),
  reloadCart: () => Promise.resolve(),
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

  const value: CartProviderValue = {
    cart: cart,
    getCart,
    updateCart,
    clearCart,
    reloadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };

import {
  // ChangeEventHandler,
  KeyboardEventHandler,
  // useState
} from 'react';
import { NavLink } from 'react-router-dom';
import { Button, InputNumber, Input, Image, message } from 'antd';
import { ApiClient } from '@shared/api/core';
import { EuroCircleOutlined } from '@ant-design/icons';
import { LineItem } from '@commercetools/platform-sdk';
import { useCart } from './useCart';
import './cart.css';

export const Cart = () => {
  const { cart, updateCart, clearCart, reloadCart } = useCart();

  const apiClient = ApiClient.getInstance();
  reloadCart();
  // console.log(cart);
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }

  // const [promocode, setPromocode] = useState('');
  // const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  //   if (event.target) {
  //     setPromocode(event.target.value);
  //   }
  // };
  // Phone promocode
  // 69.53

  function applyPromocode() {
    // console.log(promocode);
    if (cart) {
      apiClient.requestBuilder
        .me()
        .carts()
        .withId({
          ID: cart.id,
        })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'addDiscountCode',
                // code: promocode,
                code: 'Phone discount',
              },
              {
                action: 'recalculate',
                updateProductData: true,
              },
            ],
          },
        })
        .execute()
        .then((response) => {
          // console.log(response);
          updateCart(response.body);
        })
        .catch((error) => {
          successMessage('error', error.message);
          console.error(error);
        });
    }
  }

  // lineItems отвечает за количество предметов в корзине
  // key в body - Уникальный идентификатор корзины
  function updateItemInCart(newCount: string, itemId: string) {
    if (cart) {
      apiClient.requestBuilder
        .me()
        .carts()
        .withId({
          ID: cart.id,
        })
        .post({
          body: {
            version: cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: itemId,
                quantity: Number(newCount),
              },
            ],
          },
        })
        .execute()
        .then((response) => {
          updateCart(response.body);
        })
        .catch((error) => {
          successMessage('error', error.message);
          console.error(error);
        });
    }
  }

  let clickedNumber: string;
  function inputNumberChanged(event: EventTarget & HTMLInputElement) {
    const newNumber = event.value;
    const goodsKey = event.id;
    if (clickedNumber !== newNumber) {
      updateItemInCart(newNumber, goodsKey);
    }
  }

  function buttonWasClicked(event: EventTarget) {
    const htmlElement = event as HTMLButtonElement | HTMLSpanElement;
    let inputParent: HTMLButtonElement;
    if (htmlElement) {
      if (htmlElement.tagName === 'BUTTON') {
        inputParent = htmlElement.previousSibling as HTMLButtonElement;
        const elementID = inputParent.children[0].children[0].children[0].id as string;
        updateItemInCart('0', elementID);
      } else if (htmlElement.tagName === 'SPAN') {
        inputParent = (htmlElement.parentElement as HTMLSpanElement).previousSibling as HTMLButtonElement;
        const elementID = inputParent.children[0].children[0].children[0].id as string;
        updateItemInCart('0', elementID);
      }
    }
  }

  const inputNumberEnterPressed: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const newNumber = (event.target as HTMLInputElement).value;
    const goodsKey = (event.target as HTMLInputElement).id;
    if (clickedNumber !== newNumber) {
      updateItemInCart(newNumber, goodsKey);
    }
  };

  function inputNumberFocused(event: EventTarget & HTMLInputElement) {
    clickedNumber = event.value;
  }

  function fillCartWithGoods(arrayOfGoods: LineItem[]) {
    const productsArray: JSX.Element[] = [];
    if (arrayOfGoods) {
      for (let i = 0; i < arrayOfGoods.length; i += 1) {
        const obj = arrayOfGoods[i];
        const image = obj.variant.images ? obj.variant.images[0].url : '';
        const attr1 = obj.variant.attributes ? obj.variant.attributes[0].value : null;
        const atrr2 = obj.variant.attributes ? obj.variant.attributes[1].value : null;
        if (obj) {
          productsArray.push(
            <div className="cart-item-block" key={`card${i}`}>
              <Image src={image} className="cart-image" alt="product-image"></Image>
              <div className="cart-description">
                <div className="cart-name">
                  <NavLink className="product-link" to={`/product/${obj.productId}`}>
                    {obj.name.en}
                  </NavLink>
                </div>
                <div className="cart-card-description">
                  {attr1} | {atrr2}
                </div>
                <div className="card-price">
                  {obj.price.discounted ? (
                    <>
                      <span className="strike">{obj.price.value.centAmount / 100}</span>
                      <span> {obj.price.discounted.value.centAmount / 100}</span> <EuroCircleOutlined />
                    </>
                  ) : (
                    <>
                      <span>{obj.price.value.centAmount / 100}</span>
                      <EuroCircleOutlined />
                    </>
                  )}
                </div>
              </div>
              <div className="card-items-count">
                <InputNumber
                  id={obj.id}
                  min={1}
                  value={obj.quantity}
                  controls={false}
                  onFocus={(event) => inputNumberFocused(event.target)}
                  onBlur={(event) => inputNumberChanged(event.target)}
                  onPressEnter={inputNumberEnterPressed}
                ></InputNumber>
              </div>
              <Button
                className="cart-remove-item"
                onClick={(event) => {
                  buttonWasClicked(event.target);
                }}
              >
                X
              </Button>
              <hr className="line-cart-products" />
            </div>
          );
        }
        if (i === arrayOfGoods.length - 1) {
          productsArray.push(
            <div className="clearCart-button-wrapper" key="removeAllGoods">
              <Button onClick={clearCart}>Clear all cart</Button>
            </div>
          );
        }
      }
    }

    // <div className="cart-items-list">{fillCartWithGoods(cart.lineItems)}
    return productsArray.length > 0 ? <div className="cart-items-list">{productsArray}</div> : null;
  }

  function fillTotalArray() {
    if (cart) {
      const totalCentAmount = cart.lineItems.reduce((total, obj) => {
        return total + obj.price.value.centAmount * obj.quantity;
      }, 0);
      return cart.lineItems.length > 0 ? (
        <>
          <div className="cart-summary">
            <div className="summary-content-block">
              <h2 className="summary-cart-header">Order Summary</h2>
              <div className="cart-summary-block">
                <span>Subtotal</span> <span>{totalCentAmount / 100} EUR</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Shipping estimate</span>
                <span>0 EUR</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="promocode-wrapper">
                <Input
                  placeholder="Enter promocode"
                  value="Phone promocode"
                  className="promocode-input"
                  // onChange={handleInputChange}
                ></Input>
                <Button onClick={applyPromocode}>Apply</Button>
              </div>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Discounts</span>
                <span>{(totalCentAmount / 100 - cart.totalPrice.centAmount / 100).toFixed(2)}</span>
              </div>
              <hr className="line-cart-summary" />
              <div className="cart-summary-block">
                <span>Order total</span>
                <span>{cart.totalPrice.centAmount / 100} EUR</span>
              </div>
              <Button type="primary" className="cart-checkout">
                Checkout
              </Button>
            </div>
          </div>
        </>
      ) : null;
    }
  }

  function returnEmptyCart() {
    return (
      <div className="emptyCart">
        Nothing here yet. Please visit our<div>&nbsp;</div>
        <NavLink to="/catalog">Catalogue</NavLink>
      </div>
    );
  }

  return (
    <>
      <h2>Shopping Cart</h2>
      {contextHolder}
      <div className="cart-wrapper">
        {cart ? fillCartWithGoods(cart.lineItems) : null}
        {cart ? fillTotalArray() : null}
      </div>
      {cart ? (cart.lineItems.length === 0 ? returnEmptyCart() : null) : null}
    </>
  );
};

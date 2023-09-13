import { EuroCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import style from './ProductCard.module.css';
import { Button } from 'antd';

import { ApiClient } from '@shared/api/core';
import { useCart } from 'pages/Cart/useCart';

interface ProductCardMap {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  discount: number | null;
  urlImg: string;
}

const ProductCard = ({ product }: { product: ProductCardMap }) => {
  const { cart, initCart, getCurrentCart } = useCart();
  const { id, title, description, urlImg, price, discount } = product;
  const apiClient = ApiClient.getInstance();

  const has = (prodId: string) => {
    if (cart) {
      return cart.lineItems.some((prod) => prod.productId === prodId);
    }
    return false;
  };
  const isDisabled = has(id);

  const addProductCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const renewedCart = (await getCurrentCart()).data ? (await getCurrentCart()).data : cart;
    if (renewedCart) {
      apiClient.requestBuilder
        .me()
        .carts()
        .withId({
          ID: renewedCart.id,
        })
        .post({
          body: {
            version: renewedCart.version,
            actions: [
              {
                action: 'addLineItem',
                productId: id,
              },
            ],
          },
        })
        .execute()
        .then(() => {
          initCart();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Link to={`/product/${id}`} className={style.productCard}>
      <div className={style.productImg}>
        <img src={urlImg} alt={title} loading="lazy" />
      </div>
      <div className={style.productInfo}>
        <h4>{title}</h4>
        {description && <p className={style.productDescription}>{description}</p>}
        <div className={style.productPrice}>
          {discount ? (
            <>
              <small>
                <span>
                  <EuroCircleOutlined />
                </span>{' '}
                {price}
              </small>
              <span>
                <EuroCircleOutlined />
              </span>{' '}
              <strong>{discount}</strong>
            </>
          ) : (
            <span>
              <span>
                <EuroCircleOutlined />
              </span>{' '}
              {price}
            </span>
          )}
        </div>
        <Button type="primary" onClick={addProductCart} disabled={isDisabled}>
          add to cart
        </Button>
      </div>
    </Link>
  );
};

export { type ProductCardMap, ProductCard };

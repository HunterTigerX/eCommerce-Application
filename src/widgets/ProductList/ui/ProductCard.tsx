import { EuroCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import style from './ProductCard.module.css';

interface IDimentions {
  w: number;
  h: number;
}
export interface IImages {
  url: string;
  dimensions: IDimentions;
}
export interface ProductCardMap {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  discount: number | null;
  urlImg: IImages[];
}

export const ProductCard = ({ product }: { product: ProductCardMap }) => {
  const { id, title, description, urlImg, price, discount } = product;

  return (
    <Link
      to={`/product/${id}`}
      className={style.productCard}
      // onClick={() => {
      //   localStorage.setItem('product', JSON.stringify(product))
      // }}
    >
      <div className={style.productImg}>
        <img src={urlImg[0].url} alt={title} />
      </div>
      <div className={style.productInfo}>
        <h4>{title}</h4>
        {description && <p className={style.productDescription}>{description}</p>}

        {price && (
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
        )}
      </div>
    </Link>
  );
};

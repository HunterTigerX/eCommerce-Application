import { useState } from 'react';
import { Spin } from 'antd';
import { EuroCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

interface ProductCardMap {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  discount: number | null;
  urlImg: string;
}

const ProductCard = ({ product }: { product: ProductCardMap }) => {
  const { id, title, description, urlImg, price, discount } = product;
  const [loading, setImgLoading] = useState(true);

  return (
    <Link to={`/product/${id}`} className={styles.productCard}>
      <div className={styles.productImg}>
        {loading && <Spin size="large" className={styles.loader} />}
        <img
          className={loading ? styles.hidden : styles.visible}
          src={urlImg}
          alt={title}
          loading="lazy"
          onLoad={() => setImgLoading(false)}
        />
      </div>
      <div className={styles.productInfo}>
        <h4>{title}</h4>
        {description && <p className={styles.productDescription}>{description}</p>}

        {price && (
          <div className={styles.productPrice}>
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

export { type ProductCardMap, ProductCard };

import { Spin } from 'antd';
import { ProductCard } from './ui';
import { useProductProjections } from '@shared/api/products';
import styles from './ProductList.module.css';

export const ProductList = () => {
  const {
    state: { products, loading: productsLoading },
  } = useProductProjections();

  return (
    <>
      {productsLoading && <Spin size="large" />}
      {products && (
        <>
          <div className={styles.produckListContainer}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

import { Spin } from 'antd';
import { ProductCard, type ProductCardMap } from './ui';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: ProductCardMap[];
  loading: boolean;
}

export const ProductList = ({ products, loading }: ProductListProps) => {
  return (
    <>
      {loading && <Spin size="large" />}
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

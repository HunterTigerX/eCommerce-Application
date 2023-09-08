import { Spin, Pagination } from 'antd';
import { ProductCard, type ProductCardMap } from './ui/ProductCard';
import styles from './ProductList.module.css';
import { ProductProjectionsActionTypes, type ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { useEffect, useState } from 'react';

interface ProductListProps {
  products: ProductCardMap[];
  loading: boolean;
  total: number;
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  id: string | undefined;
}

const initialPage = 1;

const ProductList = ({ products, loading, total, dispatch, id }: ProductListProps) => {
  const [current, setCurrent] = useState(initialPage);

  const handlePageChange = (page: number) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_PAGE, payload: page });
    setCurrent(page);
  };

  useEffect(() => {
    if (id) {
      setCurrent(initialPage);
    }
  }, [id]);

  return (
    <>
      {!products.length && !loading && <h2 className={styles.noProductsTitle}>No Products Found</h2>}
      <Pagination
        current={current}
        disabled={loading}
        pageSize={20}
        total={total}
        showSizeChanger={false}
        onChange={handlePageChange}
        hideOnSinglePage
      />
      <div className={styles.productsListContainer}>
        {loading && (
          <div className={styles.productsListSpinBlock}>
            <Spin className={styles.spin} size="large" />
          </div>
        )}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export { ProductList };

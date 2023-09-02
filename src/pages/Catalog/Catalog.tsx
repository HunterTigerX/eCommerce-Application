import { useProductProjections } from '@shared/api/products';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { ProductsFilter } from '@features/ProductsFilter';

const Catalog = () => {
  const {
    state: { products, loading },
    dispatch,
  } = useProductProjections();

  return (
    <>
      <h2>Catalog Products</h2>
      <ProductsFilter dispatch={dispatch} />
      <Categories loading={loading} dispatch={dispatch} />
      {products && (
        <div style={{ marginTop: '1.5rem' }}>
          <ProductList products={products} loading={loading} />
        </div>
      )}
    </>
  );
};

export { Catalog };

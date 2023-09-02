import { useProductProjections, ProductProjectionsActionTypes } from '@shared/api/products';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { type Key } from 'rc-tree/lib/interface';
import { ProductsFilter } from '@features/ProductsFilter';

const Catalog = () => {
  const {
    state: { products, loading },
    dispatch: setProducts,
  } = useProductProjections();

  return (
    <>
      <h2>Catalog Products</h2>
      <ProductsFilter dispatch={setProducts} />
      <Categories
        loading={loading}
        onSelect={(id: Key) => setProducts({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: id })}
      />
      {products && (
        <div style={{ marginTop: '1.5rem' }}>
          <ProductList products={products} loading={loading} />
        </div>
      )}
    </>
  );
};

export { Catalog };

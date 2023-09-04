import { useParams } from 'react-router-dom';
import { useProductProjections } from '@shared/api/products';
import { useCategories } from '@shared/api/categories';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { ProductsFilter } from '@features/ProductsFilter';
import { Breadcrumbs } from '@features/Breadcrumbs';

const Catalog = () => {
  const { id } = useParams();

  const {
    state: { products, loading },
    dispatch,
  } = useProductProjections(id);

  const { categoriesTree } = useCategories();

  return (
    <>
      <h2>Catalog Products</h2>
      <ProductsFilter dispatch={dispatch} />
      <Breadcrumbs tree={categoriesTree} id={id} />
      <Categories loading={loading} id={id} tree={categoriesTree} />
      <ProductList products={products} loading={loading} />
    </>
  );
};

export { Catalog };

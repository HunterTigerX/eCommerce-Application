import { useParams } from 'react-router-dom';
import { useProductProjections } from '@shared/api/products';
import { useCategories } from '@shared/api/categories';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { ProductsFilter } from '@features/ProductsFilter';
import { Breadcrumbs } from '@features/Breadcrumbs';
import { ProductsSearch } from '@features/ProductsSearch';
import style from './Catalog.module.css';

const Catalog = () => {
  const { id } = useParams();

  const {
    state: { products, loading },
    dispatch,
  } = useProductProjections(id);

  const { categoriesTree } = useCategories();

  return (
    <>
      <div className={style.headerCatalog}>
        <Categories loading={loading} id={id} tree={categoriesTree} />
        <ProductsSearch dispatch={dispatch} />
        <ProductsFilter dispatch={dispatch} />
      </div>
      <Breadcrumbs tree={categoriesTree} id={id} />
      <ProductList products={products} loading={loading} />
    </>
  );
};

export { Catalog };

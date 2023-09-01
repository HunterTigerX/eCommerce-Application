import {
  useProductProjections,
  ProductProjectionsActionTypes,
  useProductSuggestions,
  ProductSuggestionsActionTypes,
} from '@shared/api/products';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { ProductsFilter } from '@features/ProductsFilter';
import styles from './Catalog.module.css';

const Catalog = () => {
  const {
    state: { products, loading },
    dispatch: setProducts,
  } = useProductProjections();

  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();

  const handleSearch = (text: string) => {
    if (text) {
      setSuggestions({ type: ProductSuggestionsActionTypes.SET_SUGGESTIONS, payload: text });
      setProducts({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
    } else {
      setProducts({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
    }
  };

  const handleSelect = (text: string) => {
    setProducts({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
  };

  const handleSort = (value: string) => {
    const [type, order] = value.split(' ');
    if (order === 'asc' || order === 'desc') {
      if (type === 'price') {
        setProducts({ type: ProductProjectionsActionTypes.SORT_BY_PRICE, payload: order });
      } else {
        setProducts({ type: ProductProjectionsActionTypes.SORT_BY_NAME, payload: order });
      }
    }
  };

  const handleClear = () => {
    // todo
    setProducts({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
  };

  return (
    <>
      <h2>Catalog Products</h2>
      <div className={styles.headerSearch}>
        <Categories
          onSelect={(id: string) => setProducts({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: id })}
        />
        <ProductsFilter
          onSearch={handleSearch}
          onSelect={handleSelect}
          suggestions={suggestions}
          onChange={handleSort}
          onClear={handleClear}
        />
      </div>

      {products && (
        <div style={{ marginTop: '1.5rem' }}>
          <ProductList products={products} loading={loading} />
        </div>
      )}
    </>
  );
};

export { Catalog };

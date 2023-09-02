import {
  useProductProjections,
  ProductProjectionsActionTypes,
  useProductSuggestions,
  ProductSuggestionsActionTypes,
} from '@shared/api/products';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { type Key } from 'rc-tree/lib/interface';
import { ProductsFilter } from '@features/ProductsFilter';

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
    if (value == 'reset') {
      return setProducts({ type: ProductProjectionsActionTypes.CLEAR_SORT });
    }
    const [sortType, order] = value.split(' ');
    setProducts({ type: ProductProjectionsActionTypes.SET_SORT, payload: [sortType, order] });
  };

  const handleClear = () => {
    // todo
    setProducts({ type: ProductProjectionsActionTypes.CLEAR_SORT });
  };

  return (
    <>
      <h2>Catalog Products</h2>
      <ProductsFilter
        onSearch={handleSearch}
        onSelect={handleSelect}
        suggestions={suggestions}
        onChange={handleSort}
        onClear={handleClear}
      />
      <Categories
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

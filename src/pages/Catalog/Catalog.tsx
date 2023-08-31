import { AutoComplete, Button } from 'antd';
import {
  useProductProjections,
  ProductProjectionsActionTypes,
  useProductSuggestions,
  ProductSuggestionsActionTypes,
} from '@shared/api/products';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';

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

  const handleSort = () => {
    if (Math.random() > 0.5) {
      setProducts({ type: ProductProjectionsActionTypes.SET_SORT, payload: ['price', 'asc'] });
    } else {
      setProducts({ type: ProductProjectionsActionTypes.SET_SORT, payload: ['name', 'desc'] });
    }
  };

  return (
    <>
      <Categories
        onSelect={(id: string) => setProducts({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: id })}
        onClear={() => setProducts({ type: ProductProjectionsActionTypes.CLEAR_CATEGORY })}
      />
      <h2>Catalog Products</h2>
      <AutoComplete
        onSearch={(text) => handleSearch(text)}
        onSelect={(text) => handleSelect(text)}
        options={suggestions}
        placeholder="Search..."
        style={{ width: 300 }}
      />
      <Button onClick={handleSort} type="primary">
        Sort By Price
      </Button>
      {products && (
        <div style={{ marginTop: '1.5rem' }}>
          <ProductList products={products} loading={loading} />
        </div>
      )}
    </>
  );
};

export { Catalog };

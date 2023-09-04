import { AutoComplete, Input } from 'antd';
import {
  ProductProjectionsActionTypes,
  type ProductProjectionsQueryArgsActions,
  ProductSuggestionsActionTypes,
  useProductSuggestions,
} from '@shared/api/products';
import style from './ProductsSearch.module.css';

export const ProductsSearch = ({ dispatch }: { dispatch: React.Dispatch<ProductProjectionsQueryArgsActions> }) => {
  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();

  const handleSuggestions = (text: string) => {
    if (text) {
      setSuggestions({ type: ProductSuggestionsActionTypes.SET_SUGGESTIONS, payload: text });
    } else {
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
    }
  };

  const handleSearch = (text: string) => {
    if (text) {
      dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
    } else {
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
    }
  };

  const handleSelect = (text: string) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
  };

  return (
    <AutoComplete
      onSearch={(text) => handleSuggestions(text)}
      onSelect={(text) => handleSelect(text)}
      options={suggestions}
      placeholder="Search..."
      className={style.productsSearch}
    >
      <Input.Search onSearch={(text) => handleSearch(text)} />
    </AutoComplete>
  );
};

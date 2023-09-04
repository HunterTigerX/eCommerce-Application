import { AutoComplete, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ProductProjectionsActionTypes,
  type ProductProjectionsQueryArgsActions,
  ProductSuggestionsActionTypes,
  useProductSuggestions,
} from '@shared/api/products';
import style from './ProductsSearch.module.css';

interface ProductsSearchProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  clearFilters: () => void;
}

export const ProductsSearch = ({ dispatch, clearFilters }: ProductsSearchProps) => {
  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();
  const navigate = useNavigate();

  const handleSuggestions = (text: string) => {
    if (text) {
      setSuggestions({ type: ProductSuggestionsActionTypes.SET_SUGGESTIONS, payload: text });
    } else {
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
    }
  };

  const handleSearch = (text: string) => {
    if (!text) return;

    if (text) {
      dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
      navigate('/catalog');
      clearFilters();
    }
  };

  const handleSelect = (text: string) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
    navigate('/catalog');
    clearFilters();
  };

  return (
    <AutoComplete
      onSearch={(text) => handleSuggestions(text)}
      onSelect={(text) => handleSelect(text)}
      options={suggestions}
      placeholder="Search in store..."
      className={style.productsSearch}
    >
      <Input.Search onSearch={(text) => handleSearch(text)} />
    </AutoComplete>
  );
};

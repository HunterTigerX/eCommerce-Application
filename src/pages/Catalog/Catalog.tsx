import { AutoComplete, List, Avatar } from 'antd';
import {
  useProductProjections,
  ProductProjectionsQueryArgsActionTypes,
  useProductSuggestions,
  ProductSuggestionsQueryArgsActionTypes,
} from '@shared/api/products';

export const Catalog = () => {
  const {
    state: { products, loading: productsLoading },
    dispatch: setProducts,
  } = useProductProjections();

  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();

  const handleSearch = (text: string) => {
    if (text) {
      setProducts({ type: ProductProjectionsQueryArgsActionTypes.SET_SEARCH, payload: text });
      setSuggestions({ type: ProductSuggestionsQueryArgsActionTypes.SET_SUGGESTION, payload: text });
    } else {
      setProducts({ type: ProductProjectionsQueryArgsActionTypes.CLEAR_SEARCH });
      setSuggestions({ type: ProductSuggestionsQueryArgsActionTypes.CLEAR_SUGGESTION });
    }
  };

  const handleSelect = (text: string) => {
    setProducts({ type: ProductProjectionsQueryArgsActionTypes.SET_SEARCH, payload: text });
  };

  return (
    <>
      <h2>Catalog Products</h2>
      <AutoComplete
        onSearch={(text) => handleSearch(text)}
        onSelect={(text) => handleSelect(text)}
        options={suggestions}
        placeholder="Search..."
        style={{ width: 300 }}
      ></AutoComplete>
      {products && (
        <List
          itemLayout="horizontal"
          dataSource={products}
          loading={productsLoading}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} size={80} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      )}
    </>
  );
};

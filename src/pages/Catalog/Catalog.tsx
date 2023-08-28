import { AutoComplete, List, Avatar } from 'antd';
import { useProductProjections, ProductProjectionsQueryArgsActionTypes } from '@shared/api/products';
import { useState } from 'react';
import { useSuggestions, type SuggestionsQueryArgs } from '@shared/api/products/useSuggestions';

// https://docs.commercetools.com/api/projects/products-search#full-text-search
// https://docs.commercetools.com/api/projects/products-suggestions

const suggestionsArgsInitialValue: SuggestionsQueryArgs = {
  limit: 10,
};

export const Catalog = () => {
  const {
    state: { products, loading },
    dispatch,
  } = useProductProjections();

  const [suggestionsArgs, setSuggestionArgs] = useState<SuggestionsQueryArgs>(suggestionsArgsInitialValue);

  const { suggestions } = useSuggestions(suggestionsArgs);

  const handleSearch = (text: string) => {
    if (text) {
      setSuggestionArgs((prev) => ({
        ...prev,
        fuzzy: true,
        'searchKeywords.en': text,
      }));
    } else {
      setSuggestionArgs((prev) => {
        delete prev.fuzzy;
        delete prev['searchKeywords.en'];

        return prev;
      });
    }
    // ok
    if (text) {
      dispatch({ type: ProductProjectionsQueryArgsActionTypes.SET_SEARCH, payload: text });
    } else {
      dispatch({ type: ProductProjectionsQueryArgsActionTypes.CLEAR_SEARCH });
    }
  };

  const handleSelect = (text: string) => {
    dispatch({ type: ProductProjectionsQueryArgsActionTypes.SET_SEARCH, payload: text });
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
          loading={loading}
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

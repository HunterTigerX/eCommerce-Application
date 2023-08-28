import { useMemo, useReducer } from 'react';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import type { Suggestion } from '@commercetools/platform-sdk';
import {
  type ProductSuggestionsQueryArgs,
  ProductSuggestionsQueryArgsActionTypes,
  productSuggestionsQueryArgsReducer,
  SEARCH_KEYWORDS_LANGUAGE,
} from '@shared/api/products/reducers';

const mapSuggestions = (suggestions: Suggestion[] | null) => {
  return suggestions ? suggestions.map((suggestion) => ({ value: suggestion.text })) : [];
};

const productSuggestionsQueryArgsInitialValue = {
  limit: 20,
};

const useProductSuggestions = (initialValue: ProductSuggestionsQueryArgs = productSuggestionsQueryArgsInitialValue) => {
  const [queryArgs, dispatch] = useReducer(productSuggestionsQueryArgsReducer, initialValue);

  const request = useMemo(
    () =>
      queryArgs[SEARCH_KEYWORDS_LANGUAGE]
        ? ApiClient.getInstance()
            .requestBuilder.productProjections()
            .suggest()
            .get({
              queryArgs: {
                ...queryArgs,
              },
            })
        : null,
    [queryArgs]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    state: {
      suggestions: mapSuggestions(queryArgs[SEARCH_KEYWORDS_LANGUAGE] ? data && data[SEARCH_KEYWORDS_LANGUAGE] : null),
      error,
      loading,
    },
    dispatch,
  };
};

export { useProductSuggestions, ProductSuggestionsQueryArgsActionTypes };

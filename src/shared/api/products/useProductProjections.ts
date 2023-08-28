import { useMemo, useReducer } from 'react';
import type { QueryParam } from '@commercetools/sdk-client-v2';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import type { ProductProjection } from '@commercetools/platform-sdk';

type ProductProjectionsQueryArgs = {
  fuzzy?: boolean;
  fuzzyLevel?: number;
  markMatchingVariants?: boolean;
  filter?: string | string[];
  'filter.facets'?: string | string[];
  'filter.query'?: string | string[];
  facet?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  localeProjection?: string | string[];
  storeProjection?: string;
  expand?: string | string[];
  [key: string]: QueryParam;
};

const enum ProductProjectionsQueryArgsActionTypes {
  SET_SEARCH = 'SET_SEARCH',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
}

type SetSearchAction = {
  type: ProductProjectionsQueryArgsActionTypes.SET_SEARCH;
  payload: string;
};

type ClearSearchAction = {
  type: ProductProjectionsQueryArgsActionTypes.CLEAR_SEARCH;
  payload?: undefined;
};

type ProductProjectionsQueryArgsActions = SetSearchAction | ClearSearchAction;

const productProjectionsQueryArgsReducer = (
  state: ProductProjectionsQueryArgs,
  { type, payload }: ProductProjectionsQueryArgsActions
) => {
  switch (type) {
    case ProductProjectionsQueryArgsActionTypes.SET_SEARCH: {
      return {
        ...state,
        fuzzy: true,
        'text.en': payload,
      };
    }
    case ProductProjectionsQueryArgsActionTypes.CLEAR_SEARCH: {
      delete state.fuzzy;
      delete state['text.en'];

      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};

const mapResults = (results: ProductProjection[] | null) => {
  return results
    ? results.map((result) => {
        return {
          title: result.name.en,
          description: result.masterVariant.price ? '¢' + result.masterVariant.price.value.centAmount : null,
          avatar: result.masterVariant.images ? result.masterVariant.images[0].url : null,
        };
      })
    : [];
};

const productProjectionsQueryArgsInitialValue = {
  limit: 20,
  priceCurrency: 'EUR',
};

const useProductProjections = (initialValue: ProductProjectionsQueryArgs = productProjectionsQueryArgsInitialValue) => {
  const [queryArgs, dispatch] = useReducer(productProjectionsQueryArgsReducer, initialValue);

  const request = useMemo(
    () =>
      ApiClient.getInstance().requestBuilder.productProjections().search().get({
        queryArgs,
      }),
    [queryArgs]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    state: {
      products: mapResults(data?.results || null),
      error,
      loading,
    },
    dispatch,
  };
};

export { useProductProjections, type ProductProjectionsQueryArgs, ProductProjectionsQueryArgsActionTypes };

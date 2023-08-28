import { useMemo, useReducer } from 'react';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import {
  ProductProjectionsQueryArgs,
  productProjectionsQueryArgsReducer,
  ProductProjectionsQueryArgsActionTypes,
} from '@shared/api/products/reducers';

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
  priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
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

export { useProductProjections, ProductProjectionsQueryArgsActionTypes };

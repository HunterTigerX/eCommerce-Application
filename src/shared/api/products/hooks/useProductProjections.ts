import { useMemo, useReducer } from 'react';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import {
  type ProductProjectionsQueryArgs,
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
} from '@shared/api/products/reducers';

const mapResults = (results: ProductProjection[] | null) => {
  return results
    ? results.map((result) => {
        const id = result.id;
        const title = result.name.en;
        const description = result.metaDescription?.en || null;
        const price = result.masterVariant.price;
        const discount = price?.discounted;
        const urlImg = result.masterVariant.images ? result.masterVariant.images : [];
        let displayedPrice = null;
        let displayedDiscount = null;
        if (price) {
          displayedPrice = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
        }
        if (price && discount) {
          displayedDiscount = discount.value.centAmount / Math.pow(10, price.value.fractionDigits);
        }
        return {
          id: id,
          title: title,
          description: description,
          price: displayedPrice,
          discount: displayedDiscount,
          urlImg: urlImg,
        };
      })
    : [];
};

const productProjectionsQueryArgsInitialValue: ProductProjectionsQueryArgs = {
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

export { useProductProjections, ProductProjectionsActionTypes };

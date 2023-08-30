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
        const urlImg = result.masterVariant.images ? result.masterVariant.images[0].url : '';
        let displayedPrice = null;
        let displayedDiscount = null;
        if (price) {
          displayedPrice = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
        }
        if (price && discount) {
          displayedDiscount = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
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
  // 'filter.query': 'categories.id:subtree("e663dd66-bed3-4692-bffb-8af2b0dc929a")',
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
      total: data?.total || 0,
      error,
      loading,
    },
    dispatch,
  };
};

export { useProductProjections, ProductProjectionsActionTypes };

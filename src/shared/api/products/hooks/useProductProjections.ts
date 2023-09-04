import { useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import {
  type ProductProjectionsQueryArgs,
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
} from '@shared/api/products/reducers';
import type { ApiRequest } from '@commercetools/platform-sdk/dist/declarations/src/generated/shared/utils/requests-utils';

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

const useProductProjections = (id: string | undefined) => {
  const [queryArgs, dispatch] = useReducer(productProjectionsQueryArgsReducer, productProjectionsQueryArgsInitialValue);
  const [request, setRequest] = useState<ApiRequest<ProductProjectionPagedSearchResponse> | null>(null);
  const navigate = useNavigate();

  const { data, error, loading } = useApiRequest(request);

  const { error: notFoundError, loading: categoryLoading } = useApiRequest(
    useMemo(() => (id ? ApiClient.getInstance().requestBuilder.categories().withId({ ID: id }).get() : null), [id])
  );

  useEffect(() => {
    if (id && !notFoundError && !categoryLoading) {
      setRequest(
        ApiClient.getInstance()
          .requestBuilder.productProjections()
          .search()
          .get({
            queryArgs: {
              ...queryArgs,
              'filter.query': `categories.id:subtree("${id}")`,
            },
          })
      );
    }

    if (id && notFoundError && !categoryLoading) {
      setRequest(() => {
        delete queryArgs['filter.query'];

        return ApiClient.getInstance()
          .requestBuilder.productProjections()
          .search()
          .get({
            queryArgs: {
              ...queryArgs,
            },
          });
      });
      navigate('/catalog');
    }

    if (!id) {
      setRequest(
        ApiClient.getInstance().requestBuilder.productProjections().search().get({
          queryArgs,
        })
      );
    }
  }, [id, notFoundError, categoryLoading, queryArgs, navigate]);

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

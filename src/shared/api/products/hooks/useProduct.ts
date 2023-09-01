import { useMemo } from 'react';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';
// import { Product } from '@commercetools/platform-sdk';

// const mapProduct = (product: Product | null) => {
//   return product ? {} : null;
// };

const useProduct = (id: string | undefined) => {
  const request = useMemo(
    () =>
      id
        ? ApiClient.getInstance()
            .requestBuilder.products()
            .withId({ ID: id })
            .get({
              queryArgs: {
                priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
              },
            })
        : null,
    [id]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    product: data,
    error,
    loading,
  };
};

export { useProduct };

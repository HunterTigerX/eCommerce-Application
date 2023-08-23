import { Button } from 'antd';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks/useApiRequest';

const getProductsRequest = ApiClient.getInstance()
  .requestBuilder.products()
  .get({
    queryArgs: {
      limit: 50,
    },
  });

export const Catalog = () => {
  const { data, loading, error } = useApiRequest(getProductsRequest);

  return (
    <>
      <h2>Catalog Products</h2>
      <Button loading={loading} type="primary">
        As loading example
      </Button>
      {error && <p>failed to get products {error.message}</p>}
      {data && (
        <div>
          <h3>Total items: {data.results.length}</h3>
          <h3>First item: </h3>
          <p>${JSON.stringify(data.results[0], null, 2)}</p>
        </div>
      )}
    </>
  );
};

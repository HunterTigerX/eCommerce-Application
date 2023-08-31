import { useParams } from 'react-router-dom';
import { Image, Spin } from 'antd';
import { useProduct } from '@shared/api/products';

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error } = useProduct(productId);

  return (
    <>
      {error && <h1>Not Found</h1>}
      {loading && <Spin size="large" />}
      {product && (
        <div>
          <p>{product.masterData.current.name.en}</p>
          <p>price: {product.masterData.current.masterVariant.price?.value.centAmount}</p>
          <Image
            src={
              (product.masterData.current.masterVariant.images &&
                product.masterData.current.masterVariant.images[0].url) ||
              ''
            }
            alt="123"
          />
        </div>
      )}
    </>
  );
};

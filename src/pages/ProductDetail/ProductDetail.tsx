import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  return (
    <>
      <div>ProductDetail</div>
      <p>Product ID: {productId}</p>
    </>
  );
};

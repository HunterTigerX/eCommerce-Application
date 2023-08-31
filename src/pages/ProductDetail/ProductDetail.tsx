import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Button, Carousel } from 'antd';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';
import { IImages } from '@widgets/ProductList/ui/ProductCard';
import './carousel.css';

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

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const itemData = useProduct(productId);
  const masterData = itemData.product ? itemData.product.masterData.current : null;

  function addCarousel() {
    const imageStyle: React.CSSProperties = {
      margin: 0,
      height: 'auto',
      maxHeight: '500px',
      width: '100%',
      objectFit: 'contain',
      marginBottom: '20px',
    };

    const carouselSlides: JSX.Element[] = [];

    let prodTitle: string, prodDescription: string | null, prodPrice: number | null, prodUrlImg: IImages[];

    if (masterData) {
      prodTitle = masterData.name.en;
      prodDescription = masterData.metaDescription ? masterData.metaDescription.en : null;
      prodPrice = masterData.masterVariant.prices ? masterData.masterVariant.prices[0].value.centAmount / 100 : null;
      // const prodDiscount = null;
      prodUrlImg = masterData.masterVariant.images as IImages[]; // Потом подправить

      for (let i = 0; i < prodUrlImg.length; i += 1) {
        carouselSlides.push(
          <div key={`slide${i}`}>
            <img style={imageStyle} src={prodUrlImg[i].url} alt="product logo" />
          </div>
        );
      }

      return (
        <>
          <div className="product-container">
            <div className="prodWrapper">
              {prodTitle ? <div className="prodName">{prodTitle}</div> : null}
              {prodDescription ? <div className="prodDesc">{prodDescription}</div> : null}
              {prodPrice ? <div className="prodPrice">Only for {prodPrice}$</div> : null}
              <Button className="someButtons">Add to cart</Button>
            </div>
            <Carousel className="slider" dotPosition={'bottom'}>
              {carouselSlides}
            </Carousel>
          </div>
        </>
      );
    }
  }

  return (
    <>
      {/* <div>ProductDetail</div>
      <p>Product ID: {productId}</p> */}
      <div>{addCarousel()}</div>
    </>
  );
};

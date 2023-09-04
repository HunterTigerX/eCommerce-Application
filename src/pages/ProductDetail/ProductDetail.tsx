import { useParams } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button, Carousel } from 'antd';
import Modal from 'react-modal';
import { CarouselRef } from 'antd/es/carousel';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';
import { IImages } from '@widgets/ProductList/ui/ProductCard';
import { EuroCircleOutlined } from '@ant-design/icons';
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
  // console.log(itemData);
  const [isBigPicModalOpened, bigPicModalIsOpen] = useState(false);
  const [carousel1Index, setCarousel1Index] = useState(0);
  const carouselRefModal = useRef<CarouselRef>(null);
  const carouselRefSmall = useRef<CarouselRef>(null);

  useEffect(() => {}, [carousel1Index]);

  const openPicModal = (slideNumber: number) => {
    setCarousel1Index(slideNumber);
    bigPicModalIsOpen(true);
  };
  const closePicModal = () => {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.goTo(carousel1Index, true);
    }
    if (carouselRefModal.current) {
      carouselRefModal.current.goTo(carousel1Index, true);
    }
    bigPicModalIsOpen(false);
  };
  const masterData = itemData.product ? itemData.product.masterData.current : null;

  function openNextSlide() {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.next();
    }
  }
  function openNextSlideModal() {
    if (carouselRefModal.current) {
      carouselRefModal.current.next();
    }
  }
  function openPrevSlide() {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.prev();
    }
  }
  function openPrevSlideModal() {
    if (carouselRefModal.current) {
      carouselRefModal.current.prev();
    }
  }
  function sliderChangedPage(currentSlide: number) {
    setCarousel1Index(currentSlide);
  }

  function addCarousel() {
    const imageStyle: React.CSSProperties = {
      margin: 0,
      height: 'auto',
      maxHeight: '500px',
      width: '100%',
      objectFit: 'contain',
      marginBottom: '20px',
    };
    const bigSlider: React.CSSProperties = {
      margin: 0,
      height: 'auto',
      maxHeight: '100%',
      width: '100%',
      objectFit: 'contain',
      marginBottom: '20px',
    };

    const carouselSlides: JSX.Element[] = [];
    const modalSlides: JSX.Element[] = [];

    let prodTitle: string,
      prodDescription: string | null,
      prodPrice: number | null,
      prodUrlImg: IImages[],
      prodDiscount: number | null;

    if (masterData) {
      prodTitle = masterData.name.en;
      prodDescription = masterData.metaDescription ? masterData.metaDescription.en : null;
      // Цена в центах идёт, но на странице указываем в долларах
      prodPrice = masterData.masterVariant.prices ? masterData.masterVariant.prices[0].value.centAmount / 100 : null;
      prodDiscount = masterData.masterVariant.price
        ? masterData.masterVariant.price.discounted
          ? masterData.masterVariant.price.discounted.value.centAmount / 100
          : null
        : null;
      prodUrlImg = masterData.masterVariant.images as IImages[]; // Потом подправить

      for (let i = 0; i < prodUrlImg.length; i += 1) {
        carouselSlides.push(
          <div key={`slide${i}`}>
            <img
              style={imageStyle}
              onClick={() => {
                openPicModal(i);
              }}
              id="imageStyle"
              className="slider-image imageStyle"
              src={prodUrlImg[i].url}
              alt="product logo"
            />
          </div>
        );
        modalSlides.push(
          <div key={`slide${i}`}>
            <img
              style={imageStyle}
              className="slider-image slider-image-modal"
              src={prodUrlImg[i].url}
              alt="product logo"
            />
          </div>
        );
      }

      const modalWindow = (
        <Modal isOpen={isBigPicModalOpened} ariaHideApp={false} onRequestClose={closePicModal}>
          <Button className="closeBigCarousel" onClick={closePicModal}>
            X
          </Button>
          <Carousel
            ref={carouselRefModal}
            className="slider-big"
            dotPosition={'bottom'}
            waitForAnimate={true}
            style={bigSlider}
            initialSlide={carousel1Index}
            afterChange={sliderChangedPage}
          >
            {modalSlides}
          </Carousel>
          {masterData.masterVariant.images ? (
            masterData.masterVariant.images.length > 1 ? (
              <div className="slider-buttons">
                <Button type="primary" className="prevSlide" onClick={openPrevSlideModal}></Button>
                <Button type="primary" className="nextSlide" onClick={openNextSlideModal}></Button>
              </div>
            ) : null
          ) : null}
        </Modal>
      );
      return (
        <>
          <div className="product-container">
            <div className="prodWrapper">
              {prodTitle ? <div className="prodName">{prodTitle}</div> : null}
              {prodDescription ? <div className="prodDesc">{prodDescription}</div> : null}
              {prodDiscount ? (
                <div className="prodPrice">
                  Only for <span className="strike">{prodPrice}</span> {prodDiscount} <EuroCircleOutlined />
                </div>
              ) : prodPrice ? (
                <div className="prodPrice">
                  Only for {prodPrice} <EuroCircleOutlined />
                </div>
              ) : null}
              <Button type="primary" className="someButtons">
                Add to cart
              </Button>
            </div>
            <Carousel
              ref={carouselRefSmall}
              className="slider"
              dotPosition={'bottom'}
              waitForAnimate={true}
              afterChange={sliderChangedPage}
            >
              {carouselSlides}
            </Carousel>
            {masterData.masterVariant.images ? (
              masterData.masterVariant.images.length > 1 ? (
                <div className="slider-buttons">
                  <Button type="primary" className="prevSlide" onClick={openPrevSlide}></Button>
                  <Button type="primary" className="nextSlide" onClick={openNextSlide}></Button>
                </div>
              ) : null
            ) : null}
            {modalWindow}
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div>{addCarousel()}</div>
    </>
  );
};

import { useState } from 'react';
import { Badge, Button, Checkbox, Drawer, Select, Slider } from 'antd';
import { ProductProjectionsActionTypes } from '@shared/api/products';
import Title from 'antd/es/typography/Title';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { type ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { ProductsSearch } from '@features/ProductsSearch';
import styles from './ProductsFilter.module.css';

interface ProductsFilterProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  id: string | undefined;
}

const CheckboxGroup = Checkbox.Group;
const optionsColor = ['black', 'grey', 'white', 'blue', 'red', 'orange'];
const optionsSize = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export const ProductsFilter = ({ dispatch, id }: ProductsFilterProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [checkedColorList, setCheckedColorList] = useState<CheckboxValueType[]>([]);
  const [checkedSizeList, setCheckedSizeList] = useState<CheckboxValueType[]>([]);
  const [selectedSort, setSelectedSort] = useState('default');
  const [isDiscountedProducts, setIsDiscountedProducts] = useState(false);
  const [countFilters, setCountFilters] = useState(0);
  const disabledButton =
    !checkedColorList.length && !checkedSizeList.length && !isDiscountedProducts && priceRange.toString() === '0,9999';

  const handleSort = (value: string) => {
    if (value === 'default') {
      setSelectedSort(value);
      return dispatch({ type: ProductProjectionsActionTypes.CLEAR_SORT });
    }

    const [sortType, order] = value.split(' ');
    dispatch({ type: ProductProjectionsActionTypes.SET_SORT, payload: [sortType, order] });

    setSelectedSort(value);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const onColorList = (list: CheckboxValueType[]) => {
    setCheckedColorList(list);
  };

  const onSizeList = (list: CheckboxValueType[]) => {
    setCheckedSizeList(list);
  };

  const countFilter = (reset?: boolean) => {
    if (reset) return setCountFilters(0);
    const colorCount = checkedColorList.length;
    const sizeCount = checkedSizeList.length;
    let count = colorCount + sizeCount;
    if (priceRange[0] !== 0 || priceRange[1] !== 9999) {
      count += 1;
      setCountFilters(count);
    } else if (isDiscountedProducts) {
      count += 1;
      setCountFilters(count);
    } else {
      setCountFilters(count);
    }
  };

  const clearFilters = () => {
    setCheckedColorList([]);
    setCheckedSizeList([]);
    setPriceRange([0, 9999]);
    setIsDiscountedProducts(false);
    countFilter(true);
    setOpen(false);
    dispatch({ type: ProductProjectionsActionTypes.CLEAR_FILTER });
  };

  const applyFilters = () => {
    const filterParameters = {
      price: priceRange.map((number) => number * 100),
      color: checkedColorList,
      size: checkedSizeList,
      discountedProducts: isDiscountedProducts,
    };
    countFilter();
    setOpen(false);
    dispatch({ type: ProductProjectionsActionTypes.SET_FILTER, payload: filterParameters });
  };

  const onDiscountedProducts = () => {
    setIsDiscountedProducts(!isDiscountedProducts);
  };

  const reset = () => {
    setCheckedColorList([]);
    setCheckedSizeList([]);
    setPriceRange([0, 9999]);
    setIsDiscountedProducts(false);
    countFilter(true);
    setOpen(false);
  };

  return (
    <>
      <ProductsSearch dispatch={dispatch} clearFilters={reset} id={id} />
      <div className={styles.productFilter}>
        <div>
          <span>Sorting: </span>
          <Select
            className={styles.selectSort}
            defaultValue={'Default'}
            onChange={(value) => handleSort(value)}
            value={selectedSort}
            options={[
              {
                value: 'price asc',
                label: 'Price: Low to High',
              },
              {
                value: 'price desc',
                label: 'Price: High to Low',
              },
              {
                value: 'name asc',
                label: 'Name: a-z',
              },
              {
                value: 'name desc',
                label: 'Name: z-a',
              },
              {
                value: 'default',
                label: 'Default',
              },
            ]}
          />
        </div>
        <Badge offset={[-10, 0]} count={countFilters}>
          <Button icon={<FilterOutlined />} onClick={showDrawer}>
            Filter
          </Button>
        </Badge>
        <Drawer style={{ paddingRight: '17px' }} title="Filter" placement="right" onClose={onClose} open={open}>
          <div className={styles.filterSection}>
            <Title level={4}>Price</Title>
            <Slider
              range
              marks={{ 0: '€0', 9999: '€9999' }}
              value={priceRange}
              min={0}
              max={9999}
              onChange={handlePriceChange}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Color</Title>
            <CheckboxGroup
              style={{ flexDirection: 'column' }}
              options={optionsColor}
              value={checkedColorList}
              onChange={onColorList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Size</Title>
            <CheckboxGroup
              style={{ flexDirection: 'column' }}
              options={optionsSize}
              value={checkedSizeList}
              onChange={onSizeList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Discounted</Title>
            <Checkbox onChange={onDiscountedProducts} checked={isDiscountedProducts}>
              Show discounted products.
            </Checkbox>
          </div>

          <div className={`${styles.controll} ${styles.filterSection}`}>
            <Button onClick={applyFilters} disabled={disabledButton}>
              Apply
            </Button>
            <Button onClick={clearFilters} disabled={disabledButton}>
              Clear
            </Button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

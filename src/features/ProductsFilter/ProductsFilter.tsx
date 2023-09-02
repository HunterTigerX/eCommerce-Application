import { useState } from 'react';
import { AutoComplete, Badge, Button, Checkbox, Drawer, Input, Select, Slider } from 'antd';
import { ProductProjectionsActionTypes } from '@shared/api/products';
import Title from 'antd/es/typography/Title';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  useProductSuggestions,
  ProductSuggestionsActionTypes,
  type ProductProjectionsQueryArgsActions,
} from '@shared/api/products';
import styles from './ProductsFilter.module.css';

interface AutoCompleteFilterProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
}

const CheckboxGroup = Checkbox.Group;
const optionsColor = ['black', 'grey', 'white', 'blue', 'red', 'orange'];
const optionsSize = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export const ProductsFilter = ({ dispatch }: AutoCompleteFilterProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [checkedColorList, setCheckedColorList] = useState<CheckboxValueType[]>([]);
  const [checkedSizeList, setCheckedSizeList] = useState<CheckboxValueType[]>([]);
  const [selectedSort, setSelectedSort] = useState<string | undefined>(undefined);
  const [isDiscountedProducts, setIsDiscountedProducts] = useState(false);
  const [countFilters, setCountFilters] = useState(0);

  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();

  const handleSuggestions = (text: string) => {
    if (text) {
      setSuggestions({ type: ProductSuggestionsActionTypes.SET_SUGGESTIONS, payload: text });
    } else {
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
    }
  };

  const handleSearch = (text: string) => {
    if (text) {
      dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
    } else {
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
    }
  };

  const handleSelect = (text: string) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
  };

  const handleSort = (value: string) => {
    if (value == 'default') {
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
    return filterParameters; //todo dispatch
  };

  const onDiscountedProducts = () => {
    setIsDiscountedProducts(!isDiscountedProducts);
  };

  return (
    <>
      <div className={styles.productFilter}>
        <AutoComplete
          onSearch={(text) => handleSuggestions(text)}
          onSelect={(text) => handleSelect(text)}
          options={suggestions}
          placeholder="Search..."
          style={{ width: 300 }}
        >
          <Input.Search onSearch={(text) => handleSearch(text)} />
        </AutoComplete>
        <div className={styles.controll}>
          <span>Sorting: </span>
          <Select
            style={{ width: 180 }}
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
                label: 'Name a-z',
              },
              {
                value: 'name desc',
                label: 'Name z-a',
              },
              {
                value: 'default',
                label: 'A set default',
              },
            ]}
          />
          <Badge count={countFilters}>
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
              <Button onClick={applyFilters}>Apply</Button>
              <Button onClick={clearFilters}>Clear</Button>
            </div>
          </Drawer>
        </div>
      </div>
    </>
  );
};

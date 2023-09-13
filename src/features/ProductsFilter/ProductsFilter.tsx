import { useState } from 'react';
import { Badge, Button, Checkbox, Drawer, Select, Slider, InputNumber, Space } from 'antd';
import { EuroCircleOutlined } from '@ant-design/icons';
import { ProductProjectionsActionTypes } from '@shared/api/products';
import Title from 'antd/es/typography/Title';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { ProductsSearch } from '@features/ProductsSearch';
import { colors, years, sort } from './data/options.json';
import styles from './ProductsFilter.module.css';

interface FilterFields {
  color: string[] | CheckboxValueType[];
  releaseDate: string[] | CheckboxValueType[];
  priceRange: number[] | [number, number];
  discountedProducts: boolean;
}

interface ProductsFilterProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  id: string | undefined;
  filter: FilterFields | null;
}

const areFiltersEqual = (current: FilterFields, applied: FilterFields) => {
  const areColorsEqual =
    current.color.length === applied.color.length && current.color.every((entry) => applied.color.includes(`${entry}`));

  const areReleaseDatesEqual =
    current.releaseDate.length === applied.releaseDate.length &&
    current.releaseDate.every((entry) => applied.releaseDate.includes(`${entry}`));

  const arePriceRangesEqual = current.priceRange.toString() === applied.priceRange.toString();

  const areDiscountedProductsEqual = current.discountedProducts === applied.discountedProducts;

  return areColorsEqual && areReleaseDatesEqual && arePriceRangesEqual && areDiscountedProductsEqual;
};

const price = {
  from: 0,
  to: 9999,
};

const initialValue: FilterFields = {
  color: [],
  releaseDate: [],
  priceRange: [price.from, price.to],
  discountedProducts: false,
};

const CheckboxGroup = Checkbox.Group;

const ProductsFilter = ({ dispatch, id, filter }: ProductsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterFields>(initialValue);
  const [selectedSort, setSelectedSort] = useState('default');
  const [countFilters, setCountFilters] = useState(0);

  const disabled =
    !filterState.color.length &&
    !filterState.releaseDate.length &&
    !filterState.discountedProducts &&
    filterState.priceRange.toString() === [price.from, price.to].toString();

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
    setIsOpen(true);
  };

  const handleSliderChange = (value: [number, number]) => {
    setFilterState((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleInfinumChange = (value: number | null) => {
    if (value) {
      if (value > filterState.priceRange[1]) return;

      return setFilterState((prev) => ({
        ...prev,
        priceRange: [value, prev.priceRange[1]],
      }));
    }
  };

  const handleSupremumChange = (value: number | null) => {
    if (value) {
      if (value < filterState.priceRange[0]) return;

      return setFilterState((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], value],
      }));
    }
  };

  const onColorList = (list: CheckboxValueType[]) => {
    setFilterState((prev) => ({
      ...prev,
      color: list,
    }));
  };

  const onReleaseList = (list: CheckboxValueType[]) => {
    setFilterState((prev) => ({
      ...prev,
      releaseDate: list,
    }));
  };

  const countFilter = (reset?: boolean) => {
    if (reset) return setCountFilters(0);
    const { color, discountedProducts, priceRange, releaseDate } = filterState;

    const colorCount = color.length;
    const dateCount = releaseDate.length;

    let count = colorCount + dateCount;

    if (priceRange[0] !== 0 || priceRange[1] !== 9999) {
      count += 1;
      setCountFilters(count);
    } else if (discountedProducts) {
      count += 1;
      setCountFilters(count);
    } else {
      setCountFilters(count);
    }
  };

  const clearFilters = () => {
    setFilterState(initialValue);
    countFilter(true);
    setIsOpen(false);

    if (filter) {
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_FILTER });
    }
  };

  const reset = () => {
    setFilterState(initialValue);
    countFilter(true);
    setIsOpen(false);
  };

  const applyFilters = () => {
    const current: FilterFields = {
      ...filterState,
      priceRange: filterState.priceRange.map((number) => number * 100),
    };

    const setFilter = () =>
      dispatch({
        type: ProductProjectionsActionTypes.SET_FILTER,
        payload: current,
      });

    if (filter) {
      const isEquals = areFiltersEqual(current, filter);

      if (!isEquals) {
        setFilter();
      }
    } else {
      setFilter();
    }

    countFilter();
    setIsOpen(false);
  };

  const onClose = () => {
    if (!filter) {
      return reset();
    }

    if ((disabled && filter) || filter) {
      const current = {
        ...filterState,
        priceRange: filterState.priceRange.map((number) => number * 100),
      };

      const isEquals = areFiltersEqual(current, filter);

      if (!isEquals) {
        setFilterState({
          ...filter,
          priceRange: [filter.priceRange[0] / 100, filter.priceRange[1] / 100],
        });
      }

      return setIsOpen(false);
    }

    if (disabled) {
      return clearFilters();
    }
  };

  const onDiscountedProducts = () => {
    setFilterState((prev) => ({
      ...prev,
      discountedProducts: !prev.discountedProducts,
    }));
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
            options={sort}
          />
        </div>
        <Badge offset={[-10, 0]} count={countFilters}>
          <Button icon={<FilterOutlined />} onClick={showDrawer}>
            Filter
          </Button>
        </Badge>
        <Drawer title="Filter" placement="right" onClose={onClose} open={isOpen}>
          <div className={styles.filterSection}>
            <Space align="baseline">
              <Title level={4}>Price</Title>
              <EuroCircleOutlined className={styles.priceCurrency} />
            </Space>
            <Slider
              range
              marks={{ [price.from]: price.from, [price.to]: price.to }}
              value={filterState.priceRange as [number, number]}
              min={price.from}
              max={price.to}
              onChange={handleSliderChange}
            />
            <Space>
              <label>
                From:
                <InputNumber
                  className={styles.infinum}
                  min={price.from}
                  max={price.to}
                  value={filterState.priceRange[0]}
                  onChange={handleInfinumChange}
                />
              </label>
              <label>
                to:
                <InputNumber
                  className={styles.supremum}
                  min={price.from}
                  max={price.to}
                  value={filterState.priceRange[1]}
                  onChange={handleSupremumChange}
                />
              </label>
            </Space>
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Color</Title>
            <CheckboxGroup
              className={styles.checkboxGroupList}
              style={{ flexDirection: 'column' }}
              options={colors}
              value={filterState.color}
              onChange={onColorList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Release Date</Title>
            <CheckboxGroup
              className={styles.checkboxGroupList}
              style={{ flexDirection: 'column' }}
              options={years}
              value={filterState.releaseDate}
              onChange={onReleaseList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Discounted</Title>
            <Checkbox onChange={onDiscountedProducts} checked={filterState.discountedProducts}>
              Show discounted products.
            </Checkbox>
          </div>

          <div className={`${styles.controll} ${styles.filterSection}`}>
            <Button onClick={applyFilters} disabled={disabled}>
              Apply
            </Button>
            <Button onClick={clearFilters} disabled={disabled}>
              Clear
            </Button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export { ProductsFilter, type FilterFields };

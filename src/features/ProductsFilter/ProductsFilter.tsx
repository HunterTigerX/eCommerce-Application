import { useState } from 'react';
import { AutoComplete, Button, Checkbox, Drawer, Select, Slider } from 'antd';
import Title from 'antd/es/typography/Title';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import styles from './ProductsFilter.module.css';

interface AutoCompleteFilterProps {
  onSearch: (text: string) => void;
  onSelect: (text: string) => void;
  onChange: (value: string) => void;
  onClear: () => void;
  suggestions: { value: string }[];
}

const CheckboxGroup = Checkbox.Group;
const optionsColor = ['black', 'grey', 'white', 'blue', 'red', 'orange'];
const optionsSize = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export const ProductsFilter = ({ onSearch, onSelect, suggestions, onChange, onClear }: AutoCompleteFilterProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999]);
  const [checkedColorList, setCheckedColorList] = useState<CheckboxValueType[]>([]);
  const [checkedSizeList, setCheckedSizeList] = useState<CheckboxValueType[]>([]);
  const [selectedSort, setSelectedSort] = useState<string | undefined>(undefined);

  const handleSearch = (text: string) => {
    onSearch(text);
  };

  const handleSelect = (text: string) => {
    onSelect(text);
  };

  const handleSort = (value: string) => {
    onChange(value);
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

  const clearFilters = () => {
    setSelectedSort(undefined);
    setCheckedColorList([]);
    setCheckedSizeList([]);
    setPriceRange([0, 99999]);
    onClear();
  };

  const applyFilters = () => {
    const filterParameters = {
      price: priceRange,
      color: checkedColorList,
      size: checkedSizeList,
    };
    console.log(filterParameters);

    return filterParameters;
  };

  return (
    <>
      <div className={styles.productFilter}>
        <AutoComplete
          className={styles.productSearch}
          onSearch={(text) => handleSearch(text)}
          onSelect={(text) => handleSelect(text)}
          options={suggestions}
          placeholder="Search..."
        ></AutoComplete>
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
            ]}
          />
          <Button icon={<FilterOutlined />} onClick={showDrawer}>
            Filter
          </Button>
          <Drawer title="Filter" placement="right" onClose={onClose} open={open}>
            <div className={styles.filterSection}>
              <Title level={4}>Price</Title>
              <Slider
                range
                marks={{ 0: '€0', 99999: '€99999' }}
                value={priceRange}
                min={0}
                max={99999}
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

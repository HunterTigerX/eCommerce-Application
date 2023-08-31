import { AutoComplete, Button, Checkbox, Drawer, Select, Slider } from 'antd';
import styles from './ProductsFilter.module.css';
import { useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

interface AutoCompleteFilterProps {
  onSearch: (text: string) => void;
  onSelect: (text: string) => void;
  onChange: (value: string) => void;
  suggestions: { value: string }[];
}
const CheckboxGroup = Checkbox.Group;
const optionsColor = ['black', 'grey', 'white', 'blue', 'red', 'orange'];
const optionsSize = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
export const ProductsFilter = ({ onSearch, onSelect, suggestions, onChange }: AutoCompleteFilterProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999]);
  const [checkedColorList, setCheckedColorList] = useState<CheckboxValueType[]>([]);
  const [checkedSizeList, setCheckedSizeList] = useState<CheckboxValueType[]>([]);

  const handleSearch = (text: string) => {
    onSearch(text);
  };

  const handleSelect = (text: string) => {
    onSelect(text);
  };

  const handleSort = (value: string) => {
    onChange(value);
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
            options={[
              {
                value: 'masterVariant.price.centAmount asc',
                label: 'Price: Low to High',
              },
              {
                value: 'masterVariant.price.centAmount desc',
                label: 'Price: High to Low',
              },
              {
                value: 'name.en asc',
                label: 'Name a-z',
              },
              {
                value: 'name.en desc',
                label: 'Name z-a',
              },
            ]}
          />
          <Button icon={<FilterOutlined />} onClick={showDrawer}>
            Filter
          </Button>
          <Drawer title="Filter" placement="right" onClose={onClose} open={open}>
            <p>Price</p>
            <Slider
              range
              marks={{ 0: '€0', 99999: '€99999' }}
              defaultValue={priceRange}
              min={0}
              max={99999}
              onChange={handlePriceChange}
            />
            <p>Color</p>
            <CheckboxGroup
              style={{ flexDirection: 'column' }}
              options={optionsColor}
              value={checkedColorList}
              onChange={onColorList}
            />
            <p>Size</p>
            <CheckboxGroup
              style={{ flexDirection: 'column' }}
              options={optionsSize}
              value={checkedSizeList}
              onChange={onSizeList}
            />
            <div>
              <Button>Apply</Button>
              <Button>Clear</Button>
            </div>
          </Drawer>
          <Button>Clear</Button>
        </div>
      </div>
    </>
  );
};

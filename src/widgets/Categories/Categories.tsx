import { useState } from 'react';
import { Button, Drawer, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { type Key } from 'rc-tree/lib/interface';
import { ProductProjectionsActionTypes, type ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { useCategories } from '@shared/api/categories/useCategories';

interface CategoriesProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  loading: boolean;
}

const Categories = ({ dispatch, loading }: CategoriesProps) => {
  const { categoriesTree } = useCategories();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (selected: Key[]) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: selected[0] });
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer title="Basic Drawer" placement="left" onClose={onClose} open={open}>
        <Tree
          disabled={loading}
          showLine
          style={{ width: 500 }}
          switcherIcon={<DownOutlined />}
          onSelect={onChange}
          treeData={categoriesTree}
        />
      </Drawer>
    </>
  );
};

export { Categories };

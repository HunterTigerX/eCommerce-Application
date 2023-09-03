import { useState } from 'react';
import { Button, Drawer, Tree, Breadcrumb } from 'antd';
import type { Key } from 'rc-tree/lib/interface';
import { DownOutlined } from '@ant-design/icons';
import { ProductProjectionsActionTypes, type ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { useCategories, type CategoryTreeNode } from '@shared/api/categories/';
import { Link } from 'react-router-dom';

interface CategoriesProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  loading: boolean;
}

const findCategoryPath = (nodes: CategoryTreeNode[], key: string) => {
  let result = '';

  for (const node of nodes) {
    if (node.key === key) {
      result = node.path;
      return result;
    }

    if (node.children.length) {
      result = findCategoryPath(node.children, key);
      if (result) {
        break;
      }
    }
  }

  return result;
};

const Categories = ({ dispatch, loading }: CategoriesProps) => {
  const { categoriesTree } = useCategories();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ title: JSX.Element | string }[]>([]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (selected: Key[]) => {
    dispatch({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: selected[0] });
    setItems(
      findCategoryPath(categoriesTree, selected[0] as string)
        .split(' / ')
        .map((item, index, arr) => {
          const [name, id] = item.split(':');

          return {
            title:
              index === arr.length - 1 ? (
                name
              ) : (
                <Link onClick={() => console.log(1)} to={id ? `/catalog?category=${id}` : ''}>
                  {name}
                </Link>
              ),
          };
        })
    );
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: items.length ? <Link to={'/catalog'}>Catalog</Link> : 'Catalog',
          },
          ...items,
        ]}
      />
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer title="Basic Drawer" placement="left" onClose={onClose} open={open}>
        <Tree
          disabled={loading}
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onChange}
          treeData={categoriesTree}
        />
      </Drawer>
    </>
  );
};

export { Categories };

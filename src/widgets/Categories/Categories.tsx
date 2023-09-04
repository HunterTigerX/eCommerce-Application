import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Tree } from 'antd';
import type { Key } from 'rc-tree/lib/interface';
import { DownOutlined } from '@ant-design/icons';
import { type CategoryTreeNode } from '@shared/api/categories/';

interface CategoriesProps {
  loading: boolean;
  id: string | undefined;
  tree: CategoryTreeNode[];
}

const Categories = ({ loading, id, tree }: CategoriesProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (selected: Key[]) => {
    if (selected.length) {
      navigate(`/catalog/${selected[0]}`);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer title="Basic Drawer" placement="left" onClose={onClose} open={open}>
        <Tree
          disabled={loading}
          activeKey={id}
          defaultExpandedKeys={id ? [id] : undefined}
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onChange}
          treeData={tree}
        />
      </Drawer>
    </>
  );
};

export { Categories };

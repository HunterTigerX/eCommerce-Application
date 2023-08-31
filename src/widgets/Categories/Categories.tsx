import { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Category, CategoryReference } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';

interface CategoryTreeNode {
  value: string; // id
  title: string; // name
  parent: string | null;
  path: string;
  children: CategoryTreeNode[];
}

const getFullPath = (category: Category, categories: Category[]) => {
  const SEPARATOR = ' / ';
  let result = category.name.en;
  let root: Category | undefined;

  if (!category.parent) return result;

  let current: CategoryReference | undefined = category.parent;

  while (current) {
    if (current.obj) {
      result += SEPARATOR + current.obj.name.en;

      current = current.obj.parent;
    } else {
      const id = current.id;

      root = categories.find((item) => item.id === id);

      current = undefined;
    }
  }

  if (root) {
    result += SEPARATOR + root.name.en;
  }

  return result.split(SEPARATOR).reverse().join(SEPARATOR);
};

type CategoriesTreeNodesRecord = Record<string, CategoryTreeNode>;

const mapCategories = (categories: Category[]): CategoriesTreeNodesRecord => {
  return categories
    .map((category) => {
      return {
        value: category.id,
        title: category.name.en,
        parent: category.parent?.id || null,
        path: getFullPath(category, categories),
        children: [],
      };
    })
    .reduce(
      (acc, node) => ({
        ...acc,
        [node.value]: node,
      }),
      {} as CategoriesTreeNodesRecord
    );
};

const getCategoriesTree = (categories: CategoriesTreeNodesRecord) => {
  const tree: CategoryTreeNode[] = [];

  for (const value in categories) {
    const node = categories[value];
    const parent = node.parent;

    if (parent) {
      categories[parent].children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
};

const getAllCategoriesRequest = ApiClient.getInstance()
  .requestBuilder.categories()
  .get({
    queryArgs: {
      limit: 500,
      expand: ['parent'],
    },
  });

const Categories = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const { data, loading } = useApiRequest(getAllCategoriesRequest);
  // const [value, setValue] = useState<string | undefined>(undefined);
  const [treeData, setTreeData] = useState<CategoryTreeNode[]>([]);

  const onChange = (newValue: string) => {
    // setValue(newValue);
    onSelect(newValue);
  };

  useEffect(() => {
    if (data) {
      const mappedCategories = mapCategories(data.results);
      const tree = getCategoriesTree(mappedCategories);

      setTreeData(tree);
    }
  }, [data]);

  return (
    <TreeSelect
      disabled={loading}
      style={{ width: 500 }}
      size="large"
      // value={value}
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="Categories"
      allowClear
      treeDefaultExpandAll={false}
      treeNodeLabelProp="path"
      switcherIcon={<DownOutlined />}
      onChange={onChange}
      treeData={treeData}
      treeLine
    />
  );
};

export { Categories };

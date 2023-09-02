import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Category, CategoryReference } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/hooks';
import { type Key } from 'rc-tree/lib/interface';

interface CategoryTreeNode {
  key: string; // id
  title: string; // name
  parent: string | null;
  path: string;
  children: CategoryTreeNode[];
}

const getFullPath = (category: Category, categories: Category[], separator = ' / ') => {
  let result = category.name.en;
  let root: Category | undefined;

  if (!category.parent) return result;

  let current: CategoryReference | undefined = category.parent;

  while (current) {
    if (current.obj) {
      result += separator + current.obj.name.en;

      current = current.obj.parent;
    } else {
      const id = current.id;

      root = categories.find((item) => item.id === id);

      current = undefined;
    }
  }

  if (root) {
    result += separator + root.name.en;
  }

  return result.split(separator).reverse().join(separator);
};

type CategoriesTreeNodesRecord = Record<string, CategoryTreeNode>;

const mapCategories = (categories: Category[]): CategoriesTreeNodesRecord => {
  return categories
    .map((category) => {
      return {
        key: category.id,
        title: category.name.en,
        parent: category.parent?.id || null,
        path: getFullPath(category, categories),
        children: [],
      };
    })
    .reduce(
      (acc, node) => ({
        ...acc,
        [node.key]: node,
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

const Categories = ({ onSelect }: { onSelect: (id: Key) => void }) => {
  const { data, loading } = useApiRequest(getAllCategoriesRequest);
  const [treeData, setTreeData] = useState<CategoryTreeNode[]>([]);

  const onChange = (selected: Key[]) => {
    const id = selected[0];
    console.log(id);

    onSelect(id);
  };

  useEffect(() => {
    if (data) {
      const mappedCategories = mapCategories(data.results);
      const tree = getCategoriesTree(mappedCategories);

      setTreeData(tree);
      console.log(tree);
    }
  }, [data]);

  return (
    <Tree
      disabled={loading}
      style={{ width: 500 }}
      switcherIcon={<DownOutlined />}
      onSelect={onChange}
      treeData={treeData}
    />
  );
};

export { Categories };

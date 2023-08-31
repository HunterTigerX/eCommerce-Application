import { ApiClient } from '@app/auth/client';
import { TreeSelect } from 'antd';
import { useApiRequest } from '@shared/hooks';
import { Category } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';

interface CategoryTreeNode {
  value: string; // id
  title: string; // name
  parent: string | null;
  children: CategoryTreeNode[];
}

type CategoriesTreeNodesRecord = Record<string, CategoryTreeNode>;

const mapCategories = (categories: Category[]): CategoriesTreeNodesRecord => {
  return categories
    .map((category) => {
      return {
        value: category.id,
        title: category.name.en,
        parent: category.parent?.id || null,
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
  const [value, setValue] = useState<string | undefined>(undefined);
  const [treeData, setTreeData] = useState<CategoryTreeNode[]>([]);

  const onChange = (newValue: string) => {
    // value = category id
    setValue(newValue);
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
      showSearch
      disabled={loading}
      style={{ width: 500 }}
      size="large"
      value={value}
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll={false}
      onChange={onChange}
      treeData={treeData}
      treeLine
    />
  );
};

export { Categories };

import type { QueryParam } from '@commercetools/sdk-client-v2';
import type { Key } from 'rc-tree/lib/interface';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

type ProductProjectionsQueryArgs = {
  fuzzy?: boolean;
  fuzzyLevel?: number;
  markMatchingVariants?: boolean;
  filter?: string | string[];
  'filter.facets'?: string | string[];
  'filter.query'?: string | string[];
  facet?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  localeProjection?: string | string[];
  storeProjection?: string;
  expand?: string | string[];
  [key: string]: QueryParam;
};

const enum ProductProjectionsActionTypes {
  SET_SEARCH = 'SET_SEARCH',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
  SET_CATEGORY = 'SET_CATEGORY',
  CLEAR_CATEGORY = 'CLEAR_CATEGORY',
  SET_SORT = 'SET_SORT',
  CLEAR_SORT = 'CLEAR_SORT',
  SET_FILTER = 'SET_FILTER',
  CLEAR_FILTER = 'CLEAR_FILTER',
  RESET = 'RESET',
}

interface ProductProjectionsFilterParameters {
  price: number[];
  color: CheckboxValueType[];
  release: CheckboxValueType[];
  discountedProducts: boolean;
}

type SetSearchAction = {
  type: ProductProjectionsActionTypes.SET_SEARCH;
  payload: string;
};

type ClearSearchAction = {
  type: ProductProjectionsActionTypes.CLEAR_SEARCH;
  payload?: undefined;
};

type SetCategoryAction = {
  type: ProductProjectionsActionTypes.SET_CATEGORY;
  payload: Key;
};

type ClearCategoryAction = {
  type: ProductProjectionsActionTypes.CLEAR_CATEGORY;
  payload?: undefined;
};

type SetSortAction = {
  type: ProductProjectionsActionTypes.SET_SORT;
  payload: [string, string];
};

type ClearSortAction = {
  type: ProductProjectionsActionTypes.CLEAR_SORT;
  payload?: undefined;
};

type ResetAction = {
  type: ProductProjectionsActionTypes.RESET;
  payload?: undefined;
};

type SetFilterAction = {
  type: ProductProjectionsActionTypes.SET_FILTER;
  payload: ProductProjectionsFilterParameters;
};

type ClearFilterAction = {
  type: ProductProjectionsActionTypes.CLEAR_FILTER;
  payload?: undefined;
};

type ProductProjectionsQueryArgsActions =
  | SetSearchAction
  | ClearSearchAction
  | SetCategoryAction
  | ClearCategoryAction
  | SetSortAction
  | ClearSortAction
  | SetFilterAction
  | ClearFilterAction
  | ResetAction;

const productProjectionsQueryArgsReducer = (
  state: ProductProjectionsQueryArgs,
  { type, payload }: ProductProjectionsQueryArgsActions
) => {
  switch (type) {
    case ProductProjectionsActionTypes.SET_SEARCH: {
      return {
        ...state,
        fuzzy: true,
        'text.en': payload,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_SEARCH: {
      delete state.fuzzy;
      delete state['text.en'];

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.SET_CATEGORY: {
      return {
        ...state,
        'filter.query': `categories.id:subtree("${payload}")`,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_CATEGORY: {
      delete state['filter.query'];

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.SET_SORT: {
      const [sortType, order] = payload;

      if (order === 'asc' || order === 'desc') {
        if (sortType === 'price') {
          return {
            ...state,
            sort: `price ${order}`,
          };
        }

        if (sortType === 'name') {
          return {
            ...state,
            sort: `name.en ${order}`,
          };
        }
      }

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_SORT: {
      delete state.sort;

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.SET_FILTER: {
      const { color, discountedProducts, price, release } = payload;
      const filter = [];

      delete state.filter;

      if (color.length) {
        filter.push(`variants.attributes.colorsList.key:${color.map((value) => `"${value}"`).join(', ')}`);
      }

      if (discountedProducts) {
        filter.push('variants.scopedPriceDiscounted:true');
      }

      if (price.length) {
        filter.push(`variants.scopedPrice.value.centAmount:range (${price[0]} to ${price[1]})`);
      }

      if (release.length) {
        filter.push(`variants.attributes.releaseDate:${release.map((value) => `"${value}"`).join(', ')}`);
      }

      return {
        ...state,
        filter: filter,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_FILTER: {
      delete state.filter;

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.RESET: {
      return {
        limit: 20,
        priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
      };
    }
    default: {
      return state;
    }
  }
};

export {
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
  type ProductProjectionsQueryArgs,
  type ProductProjectionsQueryArgsActions,
};

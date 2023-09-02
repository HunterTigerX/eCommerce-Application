import type { QueryParam } from '@commercetools/sdk-client-v2';
import { type Key } from 'rc-tree/lib/interface';

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
  CLEAR_FILTER = 'CLEAR_FILTER',
  RESET = 'RESET',
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

      return state;
    }
    case ProductProjectionsActionTypes.CLEAR_SORT: {
      delete state.sort;

      return {
        ...state,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_FILTER: {
      delete state.filter;
      // delete state['filter.query']

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

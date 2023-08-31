import type { QueryParam } from '@commercetools/sdk-client-v2';

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
  SORT_BY_PRICE = 'SORT_BY_PRICE',
  SORT_BY_NAME = 'SORT_BY_NAME',
}

type SortOrder = 'asc' | 'desc';

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
  payload: string;
};

type SortByPriceAction = {
  type: ProductProjectionsActionTypes.SORT_BY_PRICE;
  payload: SortOrder;
};

type SortByNameAction = {
  type: ProductProjectionsActionTypes.SORT_BY_NAME;
  payload: SortOrder;
};

type ProductProjectionsQueryArgsActions =
  | SetSearchAction
  | ClearSearchAction
  | SetCategoryAction
  | SortByPriceAction
  | SortByNameAction;

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
    case ProductProjectionsActionTypes.SORT_BY_PRICE: {
      return {
        ...state,
        sort: `price ${payload}`,
      };
    }
    case ProductProjectionsActionTypes.SORT_BY_NAME: {
      return {
        ...state,
        sort: `name.en ${payload}`,
      };
    }
    default: {
      return state;
    }
  }
};

export { productProjectionsQueryArgsReducer, ProductProjectionsActionTypes, type ProductProjectionsQueryArgs };

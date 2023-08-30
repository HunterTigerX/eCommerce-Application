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
}

type SetSearchAction = {
  type: ProductProjectionsActionTypes.SET_SEARCH;
  payload: string;
};

type ClearSearchAction = {
  type: ProductProjectionsActionTypes.CLEAR_SEARCH;
  payload?: undefined;
};

type ProductProjectionsQueryArgsActions = SetSearchAction | ClearSearchAction;

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
    default: {
      return state;
    }
  }
};

export { productProjectionsQueryArgsReducer, ProductProjectionsActionTypes, type ProductProjectionsQueryArgs };

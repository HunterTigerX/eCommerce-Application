import type { QueryParam } from '@commercetools/sdk-client-v2';

const SEARCH_KEYWORDS_LANGUAGE = `searchKeywords.en`;

interface ProductSuggestionsQueryArgs {
  fuzzy?: boolean;
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  staged?: boolean;
  [SEARCH_KEYWORDS_LANGUAGE]?: string;
  [key: string]: QueryParam;
}

const enum ProductSuggestionsQueryArgsActionTypes {
  SET_SUGGESTION = 'SET_SUGGESTION',
  CLEAR_SUGGESTION = 'CLEAR_SUGGESTION',
}

type SetSuggestionAction = {
  type: ProductSuggestionsQueryArgsActionTypes.SET_SUGGESTION;
  payload: string;
};

type ClearSuggestionAction = {
  type: ProductSuggestionsQueryArgsActionTypes.CLEAR_SUGGESTION;
  payload?: undefined;
};

type ProductSuggestionsQueryArgsActions = SetSuggestionAction | ClearSuggestionAction;

const productSuggestionsQueryArgsReducer = (
  state: ProductSuggestionsQueryArgs,
  { type, payload }: ProductSuggestionsQueryArgsActions
) => {
  switch (type) {
    case ProductSuggestionsQueryArgsActionTypes.SET_SUGGESTION: {
      return {
        ...state,
        fuzzy: true,
        [SEARCH_KEYWORDS_LANGUAGE]: payload,
      };
    }
    case ProductSuggestionsQueryArgsActionTypes.CLEAR_SUGGESTION: {
      delete state.fuzzy;
      delete state[SEARCH_KEYWORDS_LANGUAGE];

      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};

export {
  productSuggestionsQueryArgsReducer,
  ProductSuggestionsQueryArgsActionTypes,
  type ProductSuggestionsQueryArgs,
  SEARCH_KEYWORDS_LANGUAGE,
};

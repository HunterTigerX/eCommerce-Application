import { useMemo } from 'react';
import type { QueryParam } from '@commercetools/sdk-client-v2';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import type { Suggestion } from '@commercetools/platform-sdk';

interface SuggestionsQueryArgs {
  fuzzy?: boolean;
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  staged?: boolean;
  'searchKeywords.en'?: string;
  priceCurrency?: 'EUR';
  [key: string]: QueryParam;
}

const mapSuggestions = (suggestions: Suggestion[] | null) => {
  return suggestions ? suggestions.map((suggestion) => ({ value: suggestion.text })) : [];
};

const useSuggestions = (queryArgs: SuggestionsQueryArgs) => {
  const request = useMemo(
    () =>
      queryArgs['searchKeywords.en']
        ? ApiClient.getInstance()
            .requestBuilder.productProjections()
            .suggest()
            .get({
              queryArgs: {
                ...queryArgs,
                priceCurrency: 'EUR',
              },
            })
        : null,
    [queryArgs]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    suggestions: mapSuggestions(queryArgs['searchKeywords.en'] ? data && data['searchKeywords.en'] : null),
    error,
    loading,
  };
};

export { type SuggestionsQueryArgs, useSuggestions };

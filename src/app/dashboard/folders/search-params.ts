import { parseAsString, createLoader } from 'nuqs/server';

export const searchParamsParsers = {
  q: parseAsString.withDefault(''),
};

export const loadSearchParams = createLoader(searchParamsParsers);

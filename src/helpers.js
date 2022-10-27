import { isEmpty, isNil, anyPass } from 'ramda';

export const isNilorEmpty = anyPass([isNil, isEmpty]);

export function acronimo(str) {
  let matches = str?.match(/\b(\w)/g);
  let acronym = matches?.join('');
  return acronym;
}

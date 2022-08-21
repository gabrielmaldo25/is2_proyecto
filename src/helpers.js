import { isEmpty, isNil, anyPass } from 'ramda';

export const isNilorEmpty = anyPass([isNil, isEmpty]);

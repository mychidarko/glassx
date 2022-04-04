import { HooksUnsupportedError } from './../utils/error';
import { TrueContext } from '../@types/core';
import { createContext } from 'react';
import Engine from './engine';

export const Context = (): TrueContext<Engine> => {
  if (typeof createContext === 'function') {
    return createContext(new Engine) as TrueContext<Engine>;
  }

  throw new HooksUnsupportedError();
};

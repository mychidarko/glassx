import { HooksUnsupportedError } from './../utils/error';
import { TrueContext } from '../@types/core';
import { createContext } from 'react';
import Engine from './engine';

const Context = (): TrueContext<Engine> | null => {
  if (typeof createContext === 'function') {
    return createContext(new Engine) as TrueContext<Engine>;
  }

  throw new HooksUnsupportedError();
};

export default Context();

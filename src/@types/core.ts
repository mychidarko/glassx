import { Context } from 'react';

import { Plugin } from './plugin';
import { Reducers } from './functions';

export type State = Record<string, any>;
export type SyncGlobalState<Type = State> = null | Partial<Type> | void;
export interface AsyncGlobalState<Type = State>
  extends Promise<GlobalState<Type>> {}
export interface FunctionalGlobalState<Type = State> {
  (global: Type, reducerName?: string, reducerArgs?: any[]): GlobalState<Type>;
}

export type GlobalState<Type = State> =
  | AsyncGlobalState<Type>
  | SyncGlobalState<Type>
  | FunctionalGlobalState<Type>;

export type Options = {
  state?: State;
  reducers?: Reducers;
  modules?: Module[];
  plugins?: Plugin[];
  compareState?: boolean;
};

export type InternalOptions = {
  defaultState: State;
  state: State;
  reducers: Reducers;
  compareState: boolean;
};

export type Module = {
  namespace?: string;
  state?: State;
  reducers?: Reducers;
};

export interface TrueContext<Type> extends Context<Type> {
  _currentValue: Type;
  _currentValue2: Type;
}

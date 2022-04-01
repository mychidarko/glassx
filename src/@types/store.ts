import { Reducers } from "./functions";

export type State = Record<string, any>;
export type Hook =
  | 'onReady'
  | 'onSave'
  | 'onRead'
  | 'onReducerInvoke'
  | 'onReset';

export interface Options {
  state?: State;
  reducers?: Reducers;
  modules?: Module[];
  plugins?: any[];
  compareState?: Boolean;
}

export interface InternalOptions {
  defaultState: State;
  state: State;
  reducers: Reducers;
  compareState: Boolean;
}

export interface Module {
  namespace?: string;
  state?: State;
  reducers?: Reducers;
}

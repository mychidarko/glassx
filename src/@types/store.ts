import { Reducers } from "./functions";

export type State = Record<string, any>;

export type Options = {
  state?: State;
  reducers?: Reducers;
  modules?: Module[];
  plugins?: any[];
  compareState?: boolean;
}

export type InternalOptions = {
  defaultState: State;
  state: State;
  reducers: Reducers;
  compareState: boolean;
}

export type Module = {
  namespace?: string;
  state?: State;
  reducers?: Reducers;
}

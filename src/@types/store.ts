import { Reducers } from "./functions";
import { Plugin } from "./plugin";

export type State = Record<string, any>;

export type Options = {
  state?: State;
  reducers?: Reducers;
  modules?: Module[];
  plugins?: Plugin[];
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

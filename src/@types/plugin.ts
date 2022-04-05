import { State } from './core';

export type Hook =
  | 'onReady'
  | 'onSave'
  | 'onRead'
  | 'onReducerInvoke'
  | 'onReset';

export interface Plugin {
  onReady?: (value: State) => any;
  onSave?: (value: State) => any;
  onRead?: (value: State) => any;
  onReducerInvoke?: (value: State) => any;
  onReset?: (value: State) => any;
}

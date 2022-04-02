import { State } from "./store";

export type Hook =
  | 'onReady'
  | 'onSave'
  | 'onRead'
  | 'onReducerInvoke'
  | 'onReset';

export interface Plugin {
  onReady?: (value: State) => void;
  onSave?: (value: State) => void;
  onRead?: (value: State) => void;
  onReducerInvoke?: (value: State) => void;
  onReset?: (value: State) => void;
}

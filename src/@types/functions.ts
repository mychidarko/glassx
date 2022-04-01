import { Dispatch, SetStateAction } from 'react';
import { State } from './store';

export type useStore<StateType = any> = (
  key: string
) => [StateType, Dispatch<SetStateAction<StateType>>];

export type Reducer<State, Payload = any> = (
  prevState: State,
  action: Payload
) => State | Promise<State>;

export type Reducers = Record<
  string,
  Reducer<State> | Record<string, Reducer<State>>
>;

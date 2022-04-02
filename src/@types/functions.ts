import { Dispatch, SetStateAction } from 'react';
import { State } from './store';

export type SetStoreFn<StateType = any> = Dispatch<SetStateAction<StateType>>;

export type UseStoreFn<StateType = any> = (
  key: string
) => [StateType, SetStoreFn<StateType>];

export type Reducer<State, Payload = any> = (
  prevState: State,
  action: Payload
) => State | Promise<State>;

export type Reducers = Record<
  string,
  Reducer<State> | Record<string, Reducer<State>>
>;

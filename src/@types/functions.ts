import { Dispatch, SetStateAction } from 'react';
import { GlobalState, State } from './core';

export type SetStoreFn<StateType = any> = Dispatch<SetStateAction<StateType>>;
export type GetStateFn = (state?: string | null) => any;

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

export type Callback<StateType = State> = (
  globalState: StateType,
  stateChange: Partial<StateType>,
  reducerName?: string,
  reducerArgs?: any[]
) => GlobalState<StateType>;

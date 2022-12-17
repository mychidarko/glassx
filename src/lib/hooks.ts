import { SetStateAction } from 'react';

import GlassX from './core';
import { State } from './../@types/core';
import { SetStoreFn, Reducer } from './../@types/functions';

export function useStore<StateType = any>(): [State, SetStoreFn<State>];
export function useStore<StateType = any>(
  item: string,
  callback?: (value: StateType) => any
): [StateType, SetStoreFn<StateType>];

export function useStore<StateType = any>(
  item?: string,
  callback?: (value: StateType) => any
): [StateType, SetStoreFn<StateType>] {
  return GlassX.useStore(item, callback);
}

export function useReducer<PayloadType = any>(
  reducer: string | Reducer<State>
) {
  return GlassX.useReducer<PayloadType>(reducer);
}

export function setStore<StateType extends State = State>(
  item: SetStateAction<StateType>
) {
  return GlassX.set(item);
}

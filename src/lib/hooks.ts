import { useGlobal } from 'reactn';
import GlassX from './core';
import { State } from './../@types/core';
import { HooksUnsupportedError } from './../utils/error';
import { SetStoreFn, Reducer } from './../@types/functions';
import { SetStateAction, useContext } from 'react';

export function useStore<StateType = any>(): [State, SetStoreFn<State>];
export function useStore<StateType = any>(
  item: string
): [StateType, SetStoreFn<StateType>];

export function useStore<StateType = any>(
  item?: string
): [StateType, SetStoreFn<StateType>] {
  if (!useContext) {
    throw new HooksUnsupportedError();
  }

  return useGlobal<any, any>(item);
}

export const useReducer = (reducer: string | Reducer<State>) => {
  return GlassX.useReducer(reducer);
};

export function setStore<StateType extends State = State>(
  item: SetStateAction<StateType>
) {
  return GlassX.set(item);
}

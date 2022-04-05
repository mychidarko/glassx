import GlassX from './core';
import { Context } from './context';
import { State } from './../@types/core';
import { HooksUnsupportedError } from './../utils/error';
import { SetStoreFn, Reducer } from './../@types/functions';
import { SetStateAction, useEffect, useCallback, useContext } from 'react';
import useForceUpdate from 'use-force-update';

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

  const engine = useContext(Context());
  const forceUpdate = useForceUpdate();
  const removeForceUpdateListener = (): void => {
    engine.removePropertyListener(forceUpdate);
  };

  if (!item) {
    const stateSetter: SetStoreFn<State> = useCallback(
      newState => setStore<State>(newState),
      []
    );

    return [engine.spyState(forceUpdate), stateSetter] as any;
  }

  useEffect(
    (): VoidFunction => {
      // We add the listener as an effect, so that there are not race conditions
      //   between subscribing and unsubscribing.
      // Subscribing outside of useEffect via `spyState()[property]` will
      //   cause the re-render subscription to occur before the unmount
      //   unsubscription occurs. As a result, the unmount unsubscription
      //   removes the re-rendered subscription.
      engine.addPropertyListener(item, forceUpdate);

      // If this component ever updates or unmounts, remove the force update
      //   listener.
      return removeForceUpdateListener;
    }
  );

  const stateSetter: SetStoreFn<StateType> = useCallback(value => {
    const state = {
      [item]: value
    };

    return setStore(state);
  }, []);

  // Return both getter and setter.
  return [engine.get(item), stateSetter];
}

export const useReducer = (reducer: string | Reducer<State>) => {
  return GlassX.useReducer(reducer);
};

export function setStore<StateType extends State = State>(
  item: SetStateAction<StateType>
) {
  return GlassX.set(item);
}

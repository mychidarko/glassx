import GlassX from './core';
import useForceUpdate from 'use-force-update';
import { useCallback, useContext } from 'react';
import { Context } from './context';
import { GlobalState, State } from './../@types/core';
import { HooksUnsupportedError } from './../utils/error';
import { SetStoreFn, Reducer, Callback } from './../@types/functions';

export function useStore<StateType = any>(
  item?: string
): [StateType, SetStoreFn<StateType>] {
  if (!useContext) {
    throw new HooksUnsupportedError();
  }

  const engine = useContext(Context());
  const forceUpdate = useForceUpdate();
  // const removeForceUpdateListener = (): void => {
  //   engine.removePropertyListener(forceUpdate);
  // };

  if (!item) {
    const stateSetter: SetStoreFn<StateType> = useCallback(
      (
        newState: GlobalState<StateType>,
        callback: Callback<StateType> | null = null,
      ): Promise<StateType> => setStore(newState, callback),
      []
    );

    return [engine.getState(forceUpdate), stateSetter];
  }

  // useEffect(
  //   (): VoidFunction => {
  //     // We add the listener as an effect, so that there are not race conditions
  //     //   between subscribing and unsubscribing.
  //     // Subscribing outside of useEffect via `spyState()[property]` will
  //     //   cause the re-render subscription to occur before the unmount
  //     //   unsubscription occurs. As a result, the unmount unsubscription
  //     //   removes the re-rendered subscription.
  //     globalStateManager.addPropertyListener(property, forceUpdate);

  //     // If this component ever updates or unmounts, remove the force update
  //     //   listener.
  //     return removeForceUpdateListener;
  //   }
  // );

  const stateSetter: SetStoreFn<StateType> = useCallback(
    (value: StateType[any], callback: Callback<StateType> | null = null): Promise<StateType> => {
      const state: Partial<StateType> = Object.create(null);
      state[item] = value;
      return setStore(state, callback);
    },
    []
  );

  // Return both getter and setter.
  return [engine.state(item), stateSetter];
}

export const useReducer = (reducer: string | Reducer<State>) => {
  return GlassX.useReducer(reducer);
};

export const setStore: SetStoreFn = (item: State) => {
  return GlassX.set(item);
};

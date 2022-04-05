import { SetStateAction } from 'react';
import { Hook, Plugin } from '../@types/plugin';
import { Reducer } from '../@types/functions';
import { Options, State } from '../@types/core';
import Engine, { getEngine } from './engine';

export default class GlassX {
  protected static engine: Engine;

  /**
   * Initialize the GlassX state engine
   */
  protected static engineInit() {
    if (!this.engine) {
      this.engine = getEngine();
    }
  }

  /**
   * Initialize and configure GlassX
   * @param {Object} options Config for glassx
   */
  public static store(options: Options | null = null) {
    this.engineInit();
    this.engine.store(options);
  }

  protected static pluginInit(plugins: Plugin[]) {
    this.engineInit();
    this.engine.pluginInit(plugins);
  }

  protected static applyPluginHook(hook: Hook, params: any) {
    this.engineInit();
    this.engine.applyPluginHook(hook, params);
  }

  /**
   * Set a new value into state
   * @param {Object} state value to set into state
   */
  public static set<StateType extends State = State>(
    state: SetStateAction<StateType>
  ) {
    this.engineInit();
    let finalState: State = {};

    if (typeof state === 'function') {
      const globalState: State = this.get();
      const callableState = state as (prevState: State) => StateType;

      finalState = {
        ...finalState,
        ...callableState(globalState)
      };
    } else {
      finalState = {
        ...finalState,
        ...state
      };
    }

    this.engine.set(finalState);
  }

  /**
   * Get a value from state
   * @param {(string | null)} state key of value to retrieve from state. Returns entire state if `state` is null
   */
  public static get(state: string | null = null) {
    this.engineInit();
    return this.engine.get(state);
  }

  /**
   * Return a reducer from glassx
   * @param {string} reducerName The reducer to return
   */
  public static reducer(reducerName: string): Reducer<State> {
    this.engineInit();
    return this.engine.reducer(reducerName);
  }

  /**
   * Reset state to it's default value
   */
  public static reset() {
    this.engineInit();
    this.engine.reset();
  }

  /**
   * Call a reducer
   * @param {string|Function} reducer The reducer to call
   */
  public static useReducer(reducer: string | Reducer<State>) {
    this.engineInit();
    return this.engine.useReducer(reducer);
  }
}

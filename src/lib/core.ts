import { Hook, Plugin } from '../@types/plugin';
import { Reducer, Reducers, SetStoreFn, UseStoreFn } from '../@types/functions';
import { InternalOptions, Module, Options, State } from '../@types/core';

export default class GlassX {
  protected static plugins: Plugin[] = [];
  protected static _options: InternalOptions = {
    defaultState: {},
    state: {},
    reducers: {},
    compareState: false
  };

  /**
   * Initialize and configure GlassX
   * @param {Object} options Config for glassx
   */
  public static store(options: Options | null = null) {
    let state = options?.state || {};
    let reducers: Reducers = options?.reducers || {};
    let modules: Module[] = options?.modules || [];
    const plugins: Plugin[] = options?.plugins || [];

    this._options.compareState = options?.compareState || false;

    if (modules.length > 0) {
      modules.forEach(module => {
        let key: string | null = null;

        if (module.namespace && module.namespace.length > 0) {
          key = module.namespace;
        }

        if (module.state) {
          const mstate = module.state;

          if (key === null) {
            state = {
              ...state,
              ...mstate
            };
          } else {
            state = {
              ...state,
              [key]: mstate
            };
          }
        }

        if (module.reducers) {
          const mreducers = module.reducers;

          if (key === null) {
            reducers = {
              ...reducers,
              ...mreducers
            };
          } else {
            reducers = {
              ...reducers,
              [key]: mreducers
            } as Record<string, Record<string, Reducer<State>>>;
          }
        }
      });
    }

    setGlobal(state);

    this._options.defaultState = state;
    this._options.state = state;
    this._options.reducers = reducers;

    this.pluginInit(plugins);

    this.applyPluginHook('onReady', state);
  }

  protected static pluginInit(plugins: Plugin[]) {
    plugins.forEach((plugin: any) => {
      if (typeof plugin === 'object') {
        this.plugins.push(plugin);
      } else {
        const p = new plugin();
        this.plugins.push(p);
      }
    });
  }

  protected static applyPluginHook(hook: Hook, params: any) {
    this.plugins.forEach(plugin => {
      plugin[hook] && plugin[hook]!(params);
    });
  }

  /**
   * Set a new value into state
   * @param {Object} state value to set into state
   */
  public static set = (state: State) => {
    const globalState: State = getGlobal();

    const parts = state.split('.');

    if (parts.length > 1) {
      let selectedState = globalState[parts[0]];
      selectedState = selectedState[parts[1]];

      state = {
        ...globalState,
        [parts[0]]: {
          ...selectedState,
          ...state
        }
      };
    } else {
      state = {
        ...globalState,
        ...state
      };
    }

    this.applyPluginHook('onSave', state);

    if (this._options.compareState && this.compareState(state)) {
      return;
    }

    setGlobal(state);
  };

  /**
   * Get a value from state
   * @param {(string | null)} state key of value to retrieve from state. Returns entire state if `state` is null
   */
  public static get(state: string | null = null) {
    const globalState: State = getGlobal();

    if (!state) {
      return globalState;
    }

    this.applyPluginHook('onRead', state);

    const parts = state.split('.');
    let selectedState = globalState[parts[0]];

    if (parts.length > 1) {
      selectedState = selectedState[parts[1]];
    }

    return selectedState;
  }

  /**
   * Return a reducer from glassx
   * @param {string} reducerName The reducer to return
   */
  public static reducer(reducerName: string): Reducer<State> {
    const parts = reducerName.split('.');
    let base: any = this._options.reducers[parts[0]];

    if (parts.length > 1) {
      base = base[parts[1]];
    }

    return base;
  }

  /**
   * Reset state to it's default value
   */
  public static reset() {
    this.applyPluginHook('onReset', this._options.defaultState);
    this.set(this._options.defaultState);
  }

  protected static compareState(state: State | string) {
    state = JSON.stringify(state);
    const globalState = JSON.stringify(getGlobal());

    return state === globalState;
  }

  protected static runner(reducer: Reducer<State>) {
    return async (payload: any) => {
      const state = reducer(this.get(), payload);
      this.set(await state);
    };
  }

  /**
   * Call a reducer
   * @param {string|Function} reducer The reducer to call
   */
  public static useReducer(reducer: string | Reducer<State>) {
    if (typeof reducer === 'string') {
      return this.runner(this.reducer(reducer));
    }

    this._options.reducers[reducer.name] = reducer;
    return this.runner(this.reducer(reducer.name));
  }
}

export function useStore<StateType = any>(
  item: string
): [StateType, SetStoreFn<StateType>] {
  return useGlobal<any>(item);
}

export const useReducer = (reducer: string | Reducer<State>) => {
  return GlassX.useReducer(reducer);
};

export const setStore: SetStoreFn = (item: State) => {
  return GlassX.set(item);
};

import { setGlobal, getGlobal, useGlobal } from 'reactn';
import { Reducer, Reducers } from './@types/functions';
import {
  Hook,
  InternalOptions,
  Module,
  Options,
  State,
} from './@types/store';

export default class GlassX {
  protected static plugins: any[] = [];
  protected static _options: InternalOptions = {
    defaultState: {},
    state: {},
    reducers: {},
    compareState: false,
  };

  /**
   * Initialize and configure GlassX
   * @param {Object} options Config for glassx
   */
  public static store(options: Options | null = null) {
    let state = options?.state || {};
    let reducers: Reducers = options?.reducers || {};
    let modules: Module[] = options?.modules || [];
    const plugins = options?.plugins || [];

    this._options.compareState = options?.compareState || false;

    if (modules.length > 0) {
      modules.forEach((module) => {
        let key: string | null = null;

        if (module.namespace && module.namespace.length > 0) {
          key = module.namespace;
        }

        if (module.state) {
          const mstate = module.state;

          if (key === null) {
            state = {
              ...state,
              ...mstate,
            };
          } else {
            state = {
              ...state,
              [key]: mstate,
            };
          }
        }

        if (module.reducers) {
          const mreducers = module.reducers;

          if (key) {
            reducers = {
              ...reducers,
              [key]: mreducers,
            } as Record<string, Record<string, Reducer<State>>>;
          } else {
            reducers = {
              ...reducers,
              ...mreducers,
            };
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

  protected static pluginInit(plugins: any[]) {
    plugins.forEach((plugin) => {
      if (typeof plugin === 'object') {
        this.plugins.push(plugin);
      } else {
        const p = new plugin();
        this.plugins.push(p);
      }
    });
  }

  protected static applyPluginHook(hook: Hook, params: any) {
    this.plugins.forEach((plugin) => {
      plugin[hook] && plugin[hook](params);
    });
  }

  /**
   * Set a new value into state
   * @param {Object} state value to set into state
   */
  public static set(state: State) {
    const globalState = getGlobal();

    state = {
      ...globalState,
      ...state,
    };

    this.applyPluginHook('onSave', state);

    if (this._options.compareState && this.compareState(state)) {
      return;
    }

    setGlobal(state);
  }

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

    return globalState[state];
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
    let globalState = getGlobal();
    globalState = JSON.stringify(globalState);

    return state === globalState;
  }

  protected static runner(reducer: Reducer<State>) {
    return async (payload: Record<string, any>) => {
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

export const useStore = (item: string) => {
  return useGlobal<any>(item);
};

export const useReducer = (reducer: string) => {
  return GlassX.useReducer(reducer);
};

export const setStore = (item: State) => {
  return GlassX.set(item);
};

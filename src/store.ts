import { setGlobal, getGlobal, useGlobal } from 'reactn';
import {
  Hook,
  InternalOptions,
  Module,
  Options,
  Reducer,
  Reducers,
  State,
} from './@types/store';

export default class GlassX {
  protected static plugins: Array<any> = [];
  protected static _options: InternalOptions = {
    defaultState: {},
    state: {},
    reducers: {},
    compareState: false,
  };

  public static store(options: Options | null = null) {
    let state = options?.state || {};
    // fix this any later
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

          state = {
            ...state,
            ...mstate,
          };
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

  public static get(state: string | null = null) {
    const globalState: State = getGlobal();

    if (!state) {
      return globalState;
    }

    this.applyPluginHook('onRead', state);

    return globalState[state];
  }

  public static reducer(reducer: string): Reducer<State> {
    const parts = reducer.split('.');
    let base: any = this._options.reducers[parts[0]];

    if (parts.length > 1) {
      base = base[parts[1]];
    }

    return base;
  }

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

  public static useReducer(reducerName: string) {
    return this.runner(this.reducer(reducerName));
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

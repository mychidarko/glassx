import { Hook, Plugin } from '../@types/plugin';
import { Reducer, Reducers } from '../@types/functions';
import { InternalOptions, Module, Options, State } from '../@types/core';
import { Context } from './context';
import { objectGetListener } from './../utils/store';

export default class Engine {
  private plugins: Plugin[] = [];
  private _options: InternalOptions = {
    defaultState: {},
    state: {},
    reducers: {},
    compareState: false
  };
  private propertyListeners = new Map();

  public forceUpdate = null;

  /**
   * Initialize and configure GlassX
   * @param {Object} options Config for glassx
   */
  public store(options: Options | null = null) {
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

    this._options.defaultState = state;
    this._options.state = state;
    this._options.reducers = reducers;

    this.pluginInit(plugins);

    this.applyPluginHook('onReady', state);
  }

  public pluginInit(plugins: Plugin[]) {
    plugins.forEach((plugin: any) => {
      if (typeof plugin === 'object') {
        this.plugins.push(plugin);
      } else {
        const p = new plugin();
        this.plugins.push(p);
      }
    });
  }

  public applyPluginHook(hook: Hook, params: any) {
    this.plugins.forEach(plugin => {
      plugin[hook] && plugin[hook]!(params);
    });
  }

  /**
   * Set a new value into state
   * @param {Object} state value to set into state
   */
  public set(state: State) {
    const globalState: State = this._options.state;

    state = {
      ...globalState,
      ...state
    };

    this.applyPluginHook('onSave', state);

    if (this._options.compareState && this.compareState(state)) {
      return;
    }

    this._options.state = state;
  }

  public get(state: string | null = null) {
    const globalState: State = this._options.state;

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

  /// author: Charles Stover - ReactN
  // Map component instance to a state property.
  public addPropertyListener(property: any, propertyListener: any): void {
    // If property listeners already exist for this property,
    //   add this one to the set.
    if (this.propertyListeners.has(property)) {
      this.propertyListeners.get(property).add(propertyListener);
    }

    // If property listeners don't already exist for this property,
    //   create a set of property listeners that includes this one.
    else {
      this.propertyListeners.set(property, new Set([propertyListener]));
    }
  }

  /// author: Charles Stover - ReactN
  // Unmap a component instance from all state properties.
  public removePropertyListener(propertyListener: any): boolean {
    let removed = false;

    // Remove this property listener from the global state.
    for (const propertyListeners of this.propertyListeners.values() as any) {
      if (propertyListeners.delete(propertyListener)) {
        removed = true;
      }
    }

    return removed;
  }

  /// author: Charles Stover - ReactN
  public spyState(propertyListener: () => void) {
    // When this._options.state is read, execute the listener.
    return objectGetListener(this._options.state, (property: any) => {
      this.addPropertyListener(property, propertyListener);
    });
  }

  public reducer(reducerName: string): Reducer<State> {
    const parts = reducerName.split('.');
    let base: any = this._options.reducers[parts[0]];

    if (parts.length > 1) {
      base = base[parts[1]];
    }

    return base;
  }

  public reset() {
    this.applyPluginHook('onReset', this._options.defaultState);
    this.set(this._options.defaultState);
  }

  public useReducer(reducer: string | Reducer<State>) {
    if (typeof reducer === 'string') {
      return this.runner(this.reducer(reducer));
    }

    this._options.reducers[reducer.name] = reducer;
    return this.runner(this.reducer(reducer.name));
  }

  public compareState(state: State | string): boolean {
    state = JSON.stringify(state);
    const globalState = JSON.stringify(this._options.state);

    return state === globalState;
  }

  protected runner(reducer: Reducer<State>) {
    return async (payload: any) => {
      const state = reducer(this.get(), payload);
      this.set(await state);
    };
  }
}

export function getEngine(): Engine {
  return Context() && (Context()._currentValue2 || Context()._currentValue);
}

import { Hook, Plugin } from '../@types/plugin';
import { Reducer, Reducers } from '../@types/functions';
import { InternalOptions, Module, Options, State } from '../@types/core';

export default class Engine {
  private plugins: Plugin[] = [];
  private _options: InternalOptions = {
    defaultState: {},
    state: {},
    reducers: {},
    compareState: false
  };

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
}

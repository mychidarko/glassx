import GlassX from '..';
import { State } from '../@types/core';
import { PersistPluginOptions, PluginClass } from '../@types/plugin';

const isSSR = typeof window === 'undefined';

class PersistedState implements PluginClass {
  protected _options: Required<PersistPluginOptions> = {
    storage: !isSSR && window.localStorage,
    key: 'glassx',
    env: 'react'
  };

  public constructor(options?: PersistPluginOptions) {
    if (options) {
      this._options = {
        ...this._options,
        ...options,
      }
    }
  }

  private isReactNative() {
    return this._options.env === "react-native";
  }

  public setStorage(storage: any) {
    if (typeof storage === 'function') {
      this._options.storage = storage();
    } else {
      this._options.storage = storage;
    }
  }

  public async retrieveState() {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    const value: string | null = await this._options.storage.getItem(this._options.key);

    if (!value) {
      return undefined;
    }

    try {
      return typeof value !== 'undefined' ? JSON.parse(value) : undefined;
    } catch (err) {}

    return undefined;
  }

  public async setState(state: State) {
    let globalState = await GlassX.get();

    state = {
      ...globalState,
      ...state
    };

    await this.saveState(state);
  }

  public async saveState(state: State) {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    return await this._options.storage.setItem(this._options.key, JSON.stringify(state));
  }

  public async compareState(state: State | string) {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    state = JSON.stringify(state);
    const cache = await this._options.storage.getItem(this._options.key);
    return state === cache;
  }

  public async refresh() {
    const globalState = await GlassX.get();
    await this.saveState(globalState);
  }

  public async onSave(state: State) {
    if (!await this.compareState(state)) {
      this.setState(state);
    }
  }

  public async onReady(state: State) {
    const cache = await this.retrieveState();

    if (cache) {
      GlassX.set(cache);
      return true;
    }

    await this.saveState(state);

    return false;
  }
}

export default PersistedState;

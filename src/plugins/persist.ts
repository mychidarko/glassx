import GlassX from '..';
import { State } from '../@types/core';
import { PersistPluginOptions, Plugin } from '../@types/plugin';

const isSSR = typeof window === 'undefined';

class PersistedState implements Plugin {
  private storage: any = !isSSR && window.localStorage;
  private key: string = 'glassx';
  private env: Required<PersistPluginOptions['env']> = 'react';

  public constructor(options: PersistPluginOptions) {
    if (options.storage) {
      this.setStorage(options.storage);
    }

    if (options.key) {
      this.key = options.key;
    }

    if (options.env) {
      this.env = options.env;
    }
  }

  private isReactNative() {
    return this.env === "react-native";
  }

  public setStorage(storage: any) {
    if (typeof storage === 'function') {
      this.storage = storage();
    } else {
      this.storage = storage;
    }
  }

  public retrieveState() {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    const value: string | null = this.storage.getItem(this.key);

    if (!value) {
      return undefined;
    }

    try {
      return typeof value !== 'undefined' ? JSON.parse(value) : undefined;
    } catch (err) {}

    return undefined;
  }

  public setState(state: State) {
    let globalState = GlassX.get();

    state = {
      ...globalState,
      ...state
    };

    this.saveState(state);
  }

  public saveState(state: State) {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    return this.storage.setItem(this.key, JSON.stringify(state));
  }

  public compareState(state: State | string) {
    if (!this.isReactNative() && isSSR) {
      return;
    }

    state = JSON.stringify(state);
    const cache = this.storage.getItem(this.key);
    return state === cache;
  }

  public refresh() {
    const globalState = GlassX.get();
    this.saveState(globalState);
  }

  public onSave(state: State) {
    if (!this.compareState(state)) {
      this.setState(state);
    }
  }

  public onReady(state: State) {
    if (!this.compareState(state)) {
      const cache = this.retrieveState();

      if (cache) {
        GlassX.set(cache);
        return true;
      }

      this.saveState(state);

      return false;
    }

    return false;
  }
}

export default PersistedState;

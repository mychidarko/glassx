import GlassX from './lib/core';
export * from './@types';
import { default as PersistedState } from './plugins/persist';

export { useStore, setStore, useReducer } from './lib/hooks';
export { default as PersistedState } from './plugins/persist';

export default GlassX;

GlassX.store({
  plugins: [PersistedState],
});

# GlassX

GlassX is a simple context based state management library for React and React Native. It provides simple hooks and classes to get you started right away. No need for initializing a context or any such thing. Just start writing and reading your state.

GlassX is based on Reactn by Charles Stover but is more tailored towards speed building from the ground up and polished with modern react. It has a ton of handy features with a minimal learning curve which makes it perfect for everyone.

## Features

### No boilerplate

Right after installation, you can call `GlassX.set` to add items to your global state or use the `useStore` hook. No setup, no initializations.

### Based on react context

GlassX is based on context which makes it super fast and allows it to sit right in your app like a part of the react code itself.

### TypeScript support

GlassX is 100% written in TypeScript which gives it amazing support with most editors and allows you to create and extend types on top of it. You no longer need to stick to state management tools with sub-par type support.

### Supports advanced features

Unlike many other state management libraries out there, GlassX supports features like async reducers, hooks, plugins and modules which allow you to scope your state and reducers to particular portions of your app.

## Example Usage

```js
import { useStore } from 'glassx';

export default function Home() {
  const [something, setSomething] = useStore('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

You can also give shape to your state just as done in React, like this:

```tsx
import { useStore } from 'glassx';

type SomeType = string;

export default function Home() {
  const [something, setSomething] = useStore<SomeType>('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

## Optional Setup

As mentioned earlier, GlassX requires absolute no setup or boilerplate. You only need to do this if you want extra options, plugins, just want to set a default state for your application or want to scope your state using modules.

To get started with this, you simply need to call the `store` method on the GlassX class.

```ts
const store = GlassX.store({
  // default State
  state: {
    key: 'value'
  },

  // register reducers to call by name
  reducers: {
    reducer_name: (state, payload) => ({
      stateKey: payload,
    }),
  },

  // to use modules
  modules: [layoutModule],

  // compare state to previous state before updating
  compareState: true,

  // glassx plugins
  plugins: [PersistedState],
});
```

## Setting State

We have already seen a bunch of examples, but we basically have 3 different methods we can use to set the global state of our apps.

### useStore

The `useStore` hook is the fastest and easiest way to set and access your global state at the same time. `useStore` takes in a string which is the key of the global state you want to access and returns the current value of that state and a setter to update it just like React's `useState`.

```js
import { useStore } from 'glassx';

export default function Home() {
  const [something, setSomething] = useStore('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

If you're using TypeScript, you can give a shape to your state value instead of returning a value with type `any`.

```tsx
import { useStore } from 'glassx';

type SomeType = string;

export default function Home() {
  const [something, setSomething] = useStore<SomeType>('something');

  setTimeout(() => {
    setSomething('hobies');
  }, 3000);
  ...
```

You can also leave out the parameter passed into `useStore`. This will return the entire state back allong with a setter to update the entire global state.

```ts
const [state, setState] = useStore();
```

Just like React's `useState` hook, `useStore` allows you to pass in a function which contains the previous state which you can use in your values.

```ts
const [state, setState] = useStore();

// ...

setState((prevState) => ({
  value: prevState.value - 1,
}));
```

If you want to go with the function method, make sure your function returns the state to update. In the case of a single state item, only that item's previous state is returned.

```ts
const [state, setState] = useStore('item');

// ...

setState((previousVal) => previousVal - 1);
```

### setStore

Unlike `useStore` above, `setStore` is used to initialize or update your global state. It always takes in an object containing the values you want to update.

```ts
setStore({
  item1: 'value',
});
```

### GlassX.set

This method works exactly like the `setStore` function above

## Retrieving State

## Reducers

```ts
const UPDATE_VALUE: Reducer<State, 'increment'|'decrement'> = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

const changeCount = useReducer(UPDATE_VALUE);

changeCount('increment');
```

Find the documentation for reducers [here](https://github.com/mychidarko/glassx/wiki/Reducers)

## Modules

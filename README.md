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
const [item, setItem] = useStore('item');

// ...

setState((previousVal) => previousVal - 1);
```

### GlassX.set

Unlike `useStore` above, `set` is used to initialize or update your global state. As such, it will always take in an object, or function returning an object.

```ts
import GlassX from 'glassx';

GlassX.set({
  value: newValue
});
```

Just like the `useStore` hook, you can also pass a function into `set` directly.

```ts
import GlassX from 'glassx';

GlassX.set((prevState) => ({
  value: prevState.value + newValue
}));
```

### setStore

This is an alias for the `set` method above. You can use it if you don't want to import the GlassX class.

```ts
setStore({
  item1: 0,
});

// or

setStore((prevState) => ({
  item1: prevState.item1 + 1,
}));
```

## Retrieving State

There are 2 ways to access your global state with GlassX.

### useStore

We've already seen how to set your state using `useStore`, if you've worked with React's `useState`,
then you should have absolutely no issues working with this method. `useStore` gives you a simple
way to reactively get your state and listen for updates. This means that when your state value changes,
GlassX will smartly update your component using that paticular state value in view.

To get started, call `useStore` with the value you want to get from your global store:

```tsx
import { useStore } from 'glassx';

const [something, setSomething] = useStore<SomeType>('someState');

// `something` holds the current value set for `someState`
<div>{something}</div>;
```

### GlassX.get

As the name implies, this method allows you to directly pull up a value from your global store.
All you need to do is pass in the key of the value you want to get. One thing to note is that the value
gotten from GlassX.get is NOT reactive. This means that when the state changes, there will be no re-renders.

**Note that this changes when there is the presence of `useStore` accessing the same value in that same component.**

```ts
import GlassX from 'glasssx';

const item = GlassX.get('someState');
```

## Reducers

```ts
const UPDATE_VALUE: Reducer<State, 'increment'|'decrement'> = (state, action) => {
  switch (action) {
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

## Modules (WIP)

When your state is initialized, a react context is created in your app, however, this context is not tied to any providers
and doesn't need any providers to access it. This means that any component can access this state from anywhere in your application.

Modules allow you to manage the scope of your state to particular sections of your app, Modules basically have their own state and reducers
which are passed into `GlassX,store`. Using modules, each page can have it's own state and reducers written separately.

For a live example, you can check out [react glass example modules](https://github.com/mychidarko/react-glass/blob/master/src/views/Login/store/index.js) with
the modules registered [here](https://github.com/mychidarko/react-glass/blob/master/src/store/index.js).

When a module is defined with a `namespace` field, the state and reducers defined in that module can't be accessed without the namespace.

Example module

```ts
import GlassX, { Module } from 'glassx';

const exampleModule: Module = {
  namespace: 'moduleScope',

  // initial state
  state: {
    key: 'value',
  },

  // reducers
  reducers: {
    SET_KEY: (state, value) => ({ key: 'something new' }),
  }
};

// register module
GlassX.store({
  modules: [exampleModule],
});
```

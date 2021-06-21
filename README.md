# GlassX

One more Vue inspired feature, GlassX is a state management solution that follows a syntax close to VueX. GlassX is based on Reactn and actually uses reactn features under the hood, so after creating your glassX store, you can use useGlobal and all other reactn methods to mutate and read your global state.

For now, glassX just provides a clean way to break up your components states and reducers into seperate files and import them as modules just as done in VueX.

Both updating and reading your state require you to use directly use reactn as done in src/views/Home/Home.jsx since glassX hasn't developed those features due to performance issues.

Example state.js

```js
const state = {
  initial: "name",
};

export default state;
```

Example reducer.js

```js
export const SET_USER = (state, dispatch, payload) => ({
  user: { ...state.user, ...payload },
});
```

Example read and update state:

```js
import { useStore } from "glassx";
import { useTitle } from "@/utils/hooks";

export default function Home() {
  useTitle("Home");

  const [something, setSomething] = useStore("something");

  setTimeout(() => {
    setSomething("hobies");
  }, 3000);
  ...
```

GlassX is still under development, you can check this page for updates and new features.


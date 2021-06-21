# Glass Router (GlassRX)

Glass router is a wrapper around `react-router-dom` which provides a clean and developer friendly approach to routing in React. GlassRX provides an extensible structure which opens up your project to more scalable setups.

*GlassRX is heavily inspired by `vue-router` and bases many features and conventions off of it.*

**Glass router is still being developed and so supports only the main react router features. Check this page for feature updates😇.**

## Installation

You can easily add GlassRX to your project with:

```sh
npm i glass-router --save
```

or

```sh
yarn add glass-router
```

## Usage

To get started with glass router, simply import it in one of your base files, usually `App.js` (CRA). From there you can simply register your routes and let glass do the rest for you.

```js
// import glass router
import GlassRouter from "glass-router";

// bring in a route
import Home from "./Home";

// define all your routes
const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    name: "home",
  },
];

// initialize glass with all your routes
GlassRouter.options({ routes });

// Export routes into JSX
const Routes = () => GlassRouter.render();

// Build your app
const App = () => <Routes />;

export default App;
```

## Why use glass router?

- **Glass is easy to use**

    GlassRX focuses on simplicity and ease of use from a developer standpoint. From the example above, in order to add a new route, all you need to do is add a new route object.

    ```js
    const routes = [
        {
            path: "/",
            exact: true,
            component: Home,
            name: "home",
        },
        {
            path: "/dashboard",
            component: Dashboard,
            name: "dashboard",
        },
    ];
    ```

- **Easy to customize**

    Glass makes available an options method which allows you to make glass behave the way you want it to behave.

    ```js
    GlassRouter.options({
        // Use a hash router instead of history
        mode: "hash",
        // force full page reloads instead of SPA mode
        forceRefresh: true,
        routes
        // a lot more settings are available below
    });
    ```

- **Glass is more "scalable"**

    GlassRX gives you features which allow you to prioritize scalable and "good code" over the norm. One such feature is `named routes`. Named routes allow you to use route names instead of paths for routing...as paths can change at any time. Route names are defined on route initialization:

    ```js
    {
        path: "/dashboard",
        component: Dashboard,
        // name is defined here
        name: "dashboard",
    },
    ```

    To route to a path, you can use:

    ```js
    GlassRouter.push({ name: "dashboard" });
    ```

    You can also use the link component if you're in a component:

    ```js
    import { Link } from "glass-router";

    ...

    <Link to={{ name: "dashboard" }}>Dashboard</Link>
    ```

## Route Meta

Sometimes, you might want to attach arbitrary information to routes like classnames, who can access the route, etc. This can be achieved through the `meta` property which accepts an object of properties and can be accessed on the route location and navigation guards. You can define `meta` properties like this:

```js
GlassRouter.options({
  routes: [
    {
      path: 'bar',
      component: Bar,
      // a meta field
      meta: { requiresAuth: true }
    },
  ],
});
```

So how do we access this `meta` field?

An example use case is checking for a meta field in the global navigation guard:

```js
GlassRouter.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({ path: "/login" });

      // or

      next("/login");

      // or

      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});
```

### Middleware

Using this concept, glassRX includes a middleware feature out of the box which allows you to write middleware which should be run before routing to the intended page.

To get started, you simply need to pass the `true` to the `middleware` option.

```js
// ...

GlassRouter.options({
  routes,
  middleware: true,
});
```

Setting the `middleware` option doesn't force you to include middleware on all routes, as all routes without middleware are navigated to immediately.

After turning on the `middleware` feature, you simply need to include your desired middleware in your route meta like so:

```js
import auth from "./config/middleware/auth";

const routes = [
  {
    path: "/checkout",
    component: () => import('./Checkout'),
    name: "checkout",
    meta: {
      // middleware here
      middleware: [auth],
    },
  },
];
```

Here's an example of middleware that redirects to login if the user isn't logged in:

```js
import { hasAuth } from "../../helpers/user";

export default function auth({ next }) {
  if (hasAuth()) {
    return next();
  }

  return next({ name: "login" });
}
```

Your middleware is passed an object containing the `from`, `to` and `next` variables. `from` holds data about the route you're coming from, `to` is about the page you're routing to and `next` handles your routing. Leaving `next` empty is essentially the same as `next(to)`.

## Note

You might have noticed that everything above is very similar to vue router, glassRX includes `react-router` specific options like `exact` and `render`.

Route with `exact` prop

```js
import Home from "./Home"

export default [
  {
    path: "/",
    exact: true,
    component: Home,
    name: "home",
  },
];
```

Route with `render` instead of `component`.

```js
{
  path: "*",
  render: () => <h2>Page Not Found</h2>,
},
```

**More features are still being developed. Check this page for updates.**

## Contributors

Glass RX was developed by the collective efforts of:

- Michael Darko [@darko-mychi](https://github.ccom/darko-mychi)
- Cosmos Appiah [@console45](https://github.ccom/console45)

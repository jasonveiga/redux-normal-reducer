# Intro

This package attempts to reduce some of the boilerplate involved in managing
[normalized state](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
in redux. It attempts to define a common set of action types for manipulating
this state, such as by adding, updated, or removing items from it. It does not
(yet) manage relationships between items.

It's designed to produce a reducer to handle these action types, as well as
creators for these actions. If you want to have more control over the reducer,
you can compose your own using the lower-level reducers in this package.

The redux philosophy is followed: where an individual item is modified, an
entirely new object is produced. Where it makes sense, the `byId` and
`allIds` items in the state are copied as well, so that the `===` operator
can detect the change, and the resulting state object is also a copy. When
an action won't result in a change, the original state is returned. Anything
in the state besides `allIds` and `byId` is not modified.

# Installation

Install as a dependency:

```
npm i --save redux-normal-reducer
```

Or clone it and work with it locally.

This project was originally created with [pnpm](https://pnpm.js.org) but there's
no reason you can't use npm instead. Some npm scripts are available:

```sh
# Build it
npm run build

# Generate JSDocs
npm run jsdoc

# Test it
npm start
```

This package contains [Jest](https://jestjs.io) unit tests, and seems to have full
code coverage.

# Redux Actions

This package is opinionated about the structure actions it expects. Here are some
examples:

```javascript
// General data action, contains a single item
{
    type: "ADD",
    data: {
        id: "foo",
        name: "John"
        // Other items...
    }
}

// Array action, contains multiple items, type usually contains "ALL"
{
    type: "ADD_ALL",
    data: [{
        id: "foo",
        name: "John"
    }, {
        id: "bar",
        name: "Jane"
    }]
}

// Remove action, contains an ID
{
    type: "REMOVE",
    id: "foo"
}

// Remove many action, contains several IDs
{
    type: "REMOVE",
    ids: ["foo", "bar"]
}

// Move action, contains a source and destination ID
{
    type: "MOVE",
    from: "foo",
    to: "bar"
}
```

The value for `type` is somewhat flexible. If you're composing a reducer using the
basic reducers in the this package, `type` is ignored. If you're using the `reducer`
or `actions` factories, you can add a prefix or suffix to the action types to
customize them. Those customizations will be reflected in the action creators as well.

# Low-Level Reducers

The following reducers are available, if you wish to compose your own reducer. Each one
handles a single action type. They ignore the `type` key in the action, and simply
execute the state manipulation. All reducers have the signature:

```javascript
function (state, action) {}
```

## Unchecked Reducers

These reducers sacrifice safety for performance, and don't check the inputs to make
sure they won't result in inconsistent state (e.g. `allIds` doesn't reflect everything
that's in `byId`).

* `add` (data action): adds an item to the state
* `addAll` (array action): adds items to the state
* `create` (data action): creates an item in the state, applying a creator function first
* `createAll` (array action): creates items in the state, applying a creator function first
* `merge` (data action): merges an item with the existing item, applying a merging function first
* `mergeAll` (array action): merge many items with the existing item, applying a merging function first
* `move` (move action): moves an item
* `replace` (data action): replaces an item in the state
* `replaceAll` (array action): replaces many items in the state


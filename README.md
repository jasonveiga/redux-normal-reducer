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
npm run docs

# Test it
npm start
```

This package contains [Jest](https://jestjs.io) unit tests, and seems to have full
code coverage.

# Redux Actions

This package is opinionated about the structure of the actions it handles. Here
are some examples:

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
    type: "REMOVE_ALL",
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

# Configuring Actions

Redux encourages the use of string action types, and mapping those action types onto
constants. In addition, creating the actions is generally expected to be done using
functions, especially when using redux with React as with 
[React Redux](https://react-redux.js.org). You can use the `actions` method to take
care of creating these action types in a regular way, and optionally customize the
types using a prefix or suffix (or both).

The prefix or suffix options covers two use cases. If you want the action names to
reflect the type of data you're manipulating (e.g. a `user` or `todoItem`), you 
could use a suffix for natural semantics (e.g. `ADD_USER` or `REMOVE_USER`) or a
prefix so that actions for a particular data type get grouped together 
alphabetically (e.g. `TODO_ADD`, `TODO_REMOVE`, `USER_ADD`, `USER_REMOVE`).

The output of the `actions` method is designed to be easily destructured onto
constants in your module.

```javascript
import { actions } from 'redux-normal-reducer'

const mapping = actions({ prefix: 'USER_' })

// Destructure only what you need...
export const { USER_ADD, USER_REMOVE, USER_MERGE } = mapping.types
export const { userAdd, userRemove, userMerge } = mapping.creators

// Feel free to define your own actions...
export const SORT_USER = 'SORT_USER'
export const sortUser = (key, direction) =>
    ({ type: SORT_USER, key, direction })
```

# High-Level Reducer Factories

Use the `reducer` and `throwingReducer` methods to create Redux reducers that handle
all of the basic action types. `throwingReducer` is a customized version of `reducer`,
with the unsafe reducers replaced with throwing reducers. Since they raise exceptions,
they should be used with care in production applications, since an uncaught exception 
can terminate the application.

Each factory accepts a configuration that may (optionally) contain an action type 
prefix, a suffx, and a customized mapping for any action types where you wish to 
customize the reducer. The resulting reducer can be used with redux, e.g. using
`combineReducers`.

```javascript
import { reducer, throwingReducer, mergeReducer } from 'redux-normal-reducer'

// Plain reducer, contains all basic actions
const users = reducer()
```

```javascript
// Customize the actions with a prefix, and use a custom merge
const merger = ( existing, update ) => ({ 
    ...existing, 
    ...update, 
    updatedOn: new Date().toISOString()
})

const users = reducer({
    prefix: 'USERS_',
    customReducers: {
        USERS_MERGE: mergeReducer(merger)
    },
    defaultState: {
        allIds: [],
        byId: {},
        otherState: 1
    }
})
```

```javascript
// Use a throwing reducer in development
let users

if (process.env.NODE_ENV === 'devlopment') {
    users = throwingReducer()
} else {
    users = reducer()
}
```

# Normalizr Data

One package for handling related data and flattening the results is
[Normalizr](https://github.com/paularmstrong/normalizr). Given a nested data
structure, where individual items may contain relationships to other items,
`normalizr` will flatten the data, keeping the actual objects in one place and
maintaining relationships in the form of IDs or lists of IDs. Example:

```javascript
import { normalize, schema } from 'normalizr';

// Data such as might be retrieved from an API
let data = {
  "id": "123",
  "author": {
    "id": "1",
    "name": "Paul"
  },
  "title": "My awesome blog post",
  "comments": [
    {
      "id": "324",
      "commenter": {
        "id": "2",
        "name": "Nicole"
      }
    }
  ]
}

// -- Define schemas containing relationships --

// Define a users schema
const user = new schema.Entity('users');

// Define your comments schema
const comment = new schema.Entity('comments', {
  commenter: user
});

// Define your article
const article = new schema.Entity('articles', {
  author: user,
  comments: [comment]
});

const normalizedData = normalize(originalData, article);

// Normalized data looks like this:
{
  result: "123",
  entities: {
    "articles": {
      "123": {
        id: "123",
        author: "1",
        title: "My awesome blog post",
        comments: [ "324" ]
      }
    },
    "users": {
      "1": { "id": "1", "name": "Paul" },
      "2": { "id": "2", "name": "Nicole" }
    },
    "comments": {
      "324": { id: "324", "commenter": "2" }
    }
  }
}
```

You can create a reducer capable of handling the results of `normalizr.normalize`.
Note that `normalizr` is not a dependency of `redux-normal-reducer`, so you have to
take care of creating the schemas and normalizing your data. This reducers are
created using the following factory:

```javascript
import { 
    updateNormalizedReducer, 
    addOrMergeAllReducer, 
    reducer 
} from 'redux-normal-reducer'

// Create reducers to handle artices and users
// The key used with updateNormalizedReducer must match the
// key under "entities" in the normalized data.
const updateNormalizedArticles = updateNormalizedReducer('articles')
const updateNormalizedUsers = updateNormalizedReducer('users')

// The default method for handling the data uses addOrMergeAll
let state = { users: { byId: {}, allIds: [] }, articles: { byId: {}, allIds: [] } }
state.articles = updateNormalizedArticles(state.articles, { data: normalizedData })
state.users = updateNormalizedArticles(state.users, { data: normalizedData })

// You can customize it to use, for example a custom merge implementation
const updateNormalizedArticles = updateNormalizedReducer(
    'articles',
    addOrMergeAllReducer(myCustomMergeFunction)
)

// And integrate it into your high-level reducer factory:
const users = reducer({suffix: '_USER', customReducers: { 
    UPDATE_NORMALIZED_USER: updateNormalizedReducer('users') 
}})
```

The `UPDATE_NORMALIZED` action is supported by the actions method
described above.

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

## Safe Reducers

These reducers provide options for handling data, e.g. they'll create data if it
doesn't exist or ignore it if it already does. They're "safe" in the sense that they
won't result in inconsistent `allIds` and `byId`.

* `addIfNew` (data action): adds an item iff it doesn't already exist
* `addAllIfNew` (data action): adds items iff they don't already exist
* `addOrMerge` (data action): adds or merges an existing item into the state
* `addOrMergeAll` (array action): adds or merges several items into the state
* `addOrReplace` (data action): adds or replaces an item in the state
* `addOrReplaceAll` (array action): adds or replaces several items in the state
* `createIfNew` (data action): creates an item in the state iff it doesn't exist
* `createAllIfNew` (array action): creates items in the state iff they don't exist
* `moveSafe` (move action): only moves an item if the source exists, and the destination doesn't
* `remove` (remove action): removes an id iff it exists
* `removeAll` (remove many action): removes ids iff they exist
* `replaceExisting` (data action): replaces an item iff it already exists
* `replaceAllExisting` (array action): replaces items iff they already exist
* `reset` (data action): resets the state to an empty normalized state, or to a state provided in action.data

## Throwing Reducers

These reducers handle dangerous actions by throwing a `ReducerError`. It's probably
not a good idea to use these in production code, but rather as a means of detecting
potential pitfalls during development. The error will contain a message explaining
which items in the actions caused the problem.

* `addOrThrow`: adds, or throws if the item already exists
* `addAllOrThrow`: adds many, or throws if any item exists in the state
* `createOrThrow`: creates an item, or throws if the item already exists
* `createAllOrThrow`: creates many items, or throws if any item exists in the state
* `mergeOrThrow`: merges an item, or throws if it doesn't exist in the state
* `mergeAllOrThrow`: merges items, or throws if any don't exist in the state
* `moveOrThrow`: moves an item, or throws it doesn't exist, or there's something at the destination
* `replaceOrThrow`: replaces an item, or throws if it doesn't exist in the state
* `replaceAllOrThrow`: replaces items, or throws if any don't exist in the state

## Reducer Factories

These factories produce customized reducers, for create or merge operations. This
allows you to e.g. customize default values when creating items, or change which
properties are merged during a merge action. They accept, as appropriate, a creator
function, or a merge function:

```javascript
// These are the default creater and merger implementations, and
// they're used if you call the factories with no arguments.
const creator = data => data
const merger = (existing, merged) => ({ ...existing, ...merged })

// Create your reducers
const create = createReducer(creator)
const merge = mergeReducer(merger)
const mergeAll = mergeAllReducer(merger)

// Reset the state with a single item, plus some extra state, rather
// than empty
const reset = resetReducer({ 
   byId: { $default: {} }, allIds: [ '$default' ], foo: 'bar' 
})
// ...further customizations as needed
```

* `addOrMergeAllReducer`
* `addOrMergeReducer`
* `createAllIfNewReducer`
* `createAllReducer`
* `createIfNewReducer`
* `createReducer`
* `mergeAllReducer`
* `mergeReducer`
* `resetReducer`

# Utility Functions

Several utility functions are provided for working with a normalized state:

* `filterKnownData(state, data)`: returns items which already exist in the state
* `filterUnknownData(state, data)`: returns items which don't already exist in the state
* `toArray(state)`: Converts normalized state to any array of items
* `map(state, fn)`: Maps a function onto the result of `toArray`
* `sort(state, fn)`: Sort the result of `toArray` using `fn`
* `forEach(state, fn)`: Calls `toArray(state).forEach(fn)`
* `filter(state, fn)`: Filters the result of `toArray` using `fn`
* `exists(state, id)`: Checks whether `id` is found in `state`
* `allExist(state, ids)`: Checks whether all `ids` are found in `state`
* `anyExist(state, ids)`: Checks whether any `ids` are found in `state`

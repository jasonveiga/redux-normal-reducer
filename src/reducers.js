import { defaultCreator, shallowMerge } from "./defaults";
import { filterUnknownData, deleteKey } from "./util";

const actionFilterUnknown = (state, action) => ({
  data: action.data.filter(x => !state.byId.hasOwnProperty(x.id))
});

const actionFilterKnown = (state, action) => ({
  data: action.data.filter(x => state.byId.hasOwnProperty(x.id))
});

// A note on arrow functions: I had most of these reducers defiend as
// arrow functions at one point, but jsdoc didn't seem to like this. Either
// the functions wouldn't be correctly labeled, or correctly summarized in
// the resulting docs. I figured it was more important to have jsdocs than
// ultra-concise code so I gave up and used traditional functions.

/**
 * Adds an item to the state. Item must contain an id key. Adding an
 * item that already exists in the state will produce undefined results.
 * @summary adds action.data to the state
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export function add(state, { data }) {
  return {
    ...state,
    allIds: [...state.allIds, data.id],
    byId: { ...state.byId, [data.id]: data }
  };
}

/**
 * Adds action.data[] to the state. Items must contain an id key.
 * Adding items that already exist in the state will produce undefined results.
 * If data is empty [], the same state is returned.
 * @summary adds multiple items to the state
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export function addAll(state, { data }) {
  return data.length
    ? {
        ...state,
        allIds: [...state.allIds, ...data.map(x => x.id)],
        byId: data.reduce(
          (byId, x) => {
            byId[x.id] = x;
            return byId;
          },
          { ...state.byId }
        )
      }
    : state;
}

/**
 * Produces an addOrMerge reducer, that utilizes a custom merge function. The
 * default merge accepts and merges data objects: { ...existing, ...update }.
 * The reducer accepts a state and an action. action.data will contain the update,
 * and action.data.id must exist. If action.data.id exists in the state, it's
 * merged. If it doesn't exist, it's action.data is added.
 * @summary Returns custom addOrMerge reducer
 * @see add
 * @see mergeReducer
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function addOrMergeReducer(merger = shallowMerge) {
  const merge = mergeReducer(merger);

  return function addOrMerge(state, action) {
    return state.byId.hasOwnProperty(action.data.id)
      ? merge(state, action, merger)
      : add(state, action);
  };
}

/**
 * @function addOrMerge
 * Default addOrMerge reducer
 * @see addOrMergeReducer
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export const addOrMerge = addOrMergeReducer();

/**
 * Produces an addOrMergeAll reducer, which may use a custom merge function.
 * The default merge accepts and merges data objects:
 * { ...existing, ...update }
 * The resulting reducer accepts a state and an action, where action.data
 * contains an array of items to be merged. Each item must have an id key. If
 * a merge item exists in the state, it's merged. If it doesn't exist, it's
 * added.
 * If data is empty [], the same state is returned.
 * @summary returns add/merge all reducer, with custom merge function
 * @see addAll
 * @see mergeAllReducer
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function addOrMergeAllReducer(merger = shallowMerge) {
  const mergeAll = mergeAllReducer(merger);

  return function addOrMergeAll(state, action) {
    return mergeAll(
      addAll(state, actionFilterUnknown(state, action)),
      actionFilterKnown(state, action)
    );
  };
}

/**
 * @function addOrMergeAll
 * Default addOrMergeAll reducer
 * @see addOrMergeAllReducer
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export const addOrMergeAll = addOrMergeAllReducer();

/**
 * If action.data.id exists in the state, it's replaced. If it doesn't, it's added.
 * @summary add or replace action.data in the state
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export function addOrReplace(state, action) {
  return state.byId.hasOwnProperty(action.data.id)
    ? replace(state, action)
    : add(state, action);
}

/**
 * Add or replace an array of items (action.data) in the state. For each item,
 * if its id exists in the state, it's replaced. If it doesn't, it's added.
 * If data is empty [], the same state is returned.
 * @summary add/replace multiple items
 * @param {NormalizedState} state
 * @param {ArraAction} action
 * @return {NormalizedState} new state
 */
export function addOrReplaceAll(state, { data }) {
  if (!data.length) {
    return state;
  }

  let newIds = filterUnknownData(state, data).map(x => x.id);

  let byId = data.reduce(
    (byId, x) => {
      byId[x.id] = x;
      return byId;
    },
    { ...state.byId }
  );

  return {
    ...state,
    allIds: newIds.length ? [...state.allIds, ...newIds] : state.allIds,
    byId
  };
}

/**
 * Generates a reducer for creating a new item and adding it to the state,
 * using a custom function for creating the item. The default function simply
 * accepts and returns the item as-is. However, a custom function could be used,
 * e.g. to provide default values for the created item.
 * The resulting reducer accepts a state and an action, where action.data contains
 * the item to be created. action.data.id must be defined. If the id already exists
 * in the state, the result is undefined.
 *
 * @example <caption>Custom creator method</caption>
 * // Each created item has the key a set to 'foo'
 * // by default if one isn't provided:
 * const create = createReducer(data => ({ a: 'foo', ...data }))
 * @summary create reducer with custom create function
 * @param {function} creator
 * @return {function} create reducer
 */
export function createReducer(creator = defaultCreator) {
  return function create(state, { data }) {
    return add(state, { data: creator(data) });
  };
}

/**
 * @function create
 * Default create reducer
 * @see createReducer
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export const create = createReducer();

/**
 * Generates a reducer for creating new items and adding them to the state,
 * using a custom function for creating the items (see {@link createReducer}).
 * The resulting reducer accepts a state and an action, where action.data contains
 * an array of items to be created. Each item must have an id. If the id already
 * exists in the state, the result is undefined. If data is [] (empty), the same
 * state is returned.
 * @summary produces a create-many reducer with custom creator function
 * @param {function} creator
 * @return {function} create reducer
 */
export function createAllReducer(creator = defaultCreator) {
  return function createAll(state, { data }) {
    if (!data.length) {
      return state;
    }

    data = data.map(creator);

    return {
      ...state,
      allIds: [...state.allIds, ...data.map(x => x.id)],
      byId: data.reduce(
        (byId, x) => {
          byId[x.id] = x;
          return byId;
        },
        { ...state.byId }
      )
    };
  };
}

/**
 * @function createAll
 * Default createAll reducer
 * @see createAllReducer
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export const createAll = createAllReducer();

/**
 * Produces a merge reducer, that utilizes a custom function for merging data. The
 * default merge function accepts and merges data objects: { ...existing, ...update }.
 * The reducer accepts a state and an action, where action.data contains the update,
 * and action.data.id must exist in the state, if it doesn't the results are undefined.
 * @summary produces a merge reducer with custom merge function
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function mergeReducer(merger = shallowMerge) {
  return function merge(state, { data }) {
    return replace(state, { data: merger(state.byId[data.id], data) });
  };
}

/**
 * @function merge
 * Default merge reducer
 * @see mergeReducer
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export const merge = mergeReducer();

/**
 * Produces an mergeAll reducer, which may use a custom merge function.
 * The default merge accepts and merges data objects:
 * { ...existing, ...update }
 * The resulting reducer accepts a state and an action, where action.data
 * contains an array of items to be merged. Each item must have an id key.
 * If any item's id doesn't exist in the state, the results are undefined.
 * If data is empty [], the same state is returned.
 * @summary produces reducer for merging many items, w/custom merge function
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function mergeAllReducer(merger = shallowMerge) {
  return function mergeAll(state, { data }) {
    return replaceAll(state, {
      data: data.map(x => merger(state.byId[x.id], x))
    });
  };
}

/**
 * @function mergerAll
 * Default merge all reducer
 * @see mergeAllReducer
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export const mergeAll = mergeAllReducer();

/**
 * Move an existing item. The action must contain from and to, which are IDs.
 * If from doesn't exist, or if to already exists, than the results are undefined.
 * @summary move an exsiting item in the state
 * @see moveSafe
 * @param {NormalizedState} state
 * @param {MoveAction} action
 * @return {NormalizedState} new state
 */
export function move(state, { from, to }) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from], id: to };
  delete byId[from];
  return { ...state, allIds, byId };
}

/**
 * Replace an existing item (action.data), where action.data.id exists in the
 * state. If it doesn't exist, the results will be undefined.
 * @summary replace an item in the state
 * @see addOrReplace
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export function replace(state, { data }) {
  return { ...state, byId: { ...state.byId, [data.id]: data } };
}

/**
 * Replace many existing items (action.data). Each item's id must exist in the
 * state. If it doesn't exist, the results will be undefined. If action.data is
 * empty [], then the same state is returned.
 * @summary replace many items in the state
 * @see addOrReplace
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export function replaceAll(state, { data }) {
  return data.length
    ? {
        ...state,
        byId: data.reduce(
          (byId, x) => {
            byId[x.id] = x;
            return byId;
          },
          { ...state.byId }
        )
      }
    : state;
}

/**
 * Remove an item, identified by action.id. If the item doesn't exist in the state,
 * the same state is returned.
 * @summary remove an item from the state
 * @param {NormalizedState} state
 * @param {RemoveAction} action
 * @return {NormalizedState} new state
 */
export function remove(state, { id }) {
  return state.byId.hasOwnProperty(id)
    ? {
        ...state,
        allIds: state.allIds.filter(i => i !== id),
        byId: deleteKey(state.byId, id)
      }
    : state;
}

/**
 * Remove several items, whose IDs are in the array action.ids. If none of the items
 * exist in the state, or if action.ids is an empty array, the same state is returned.
 * @summary remove many items from the state
 * @param {NormalizedState} state
 * @param {RemoveAllAction} action
 * @return {NormalizedState} new state
 */
export function removeAll(state, { ids }) {
  if (!ids.length) {
    return state;
  }

  ids = new Set(ids);
  let allIds = state.allIds.filter(i => !ids.has(i));

  if (allIds.length === state.allIds.length) {
    return state;
  }

  let byId = allIds.reduce((byId, i) => {
    byId[i] = state.byId[i];
    return byId;
  }, {});

  return { ...state, allIds, byId };
}

/**
 * Add an item iff it doesn't already exist in the state (a safe version of {@link add})
 * @summary add an item to the state if it's new
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export function addIfNew(state, action) {
  return state.byId.hasOwnProperty(action.data.id) ? state : add(state, action);
}

/**
 * Add items (action.data) that don't already exist in the state (a safe version of
 * {@link addAll})
 * @summary add new items to the state
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export function addAllIfNew(state, action) {
  return addAll(state, actionFilterUnknown(state, action));
}

/**
 * Returns a reducer that will create an item if it doesn't already exist in the state,
 * using a custom creator function. The default creator uses action.data as-is. If
 * the item already exists, the same state is returned. This is the safe version of
 * {@link createReducer}
 * @summary produces create-if-new reducer, with custom creator function
 * @param {function} creator custom creator function, defaults to item => item
 * @return {function} create reducer
 */
export function createIfNewReducer(creator = defaultCreator) {
  const create = createReducer(creator);

  return function createIfNew(state, action) {
    return state.byId.hasOwnProperty(action.data.id)
      ? state
      : create(state, action);
  };
}

/**
 * @function createIfNew
 * Default reducer created by {@link createIfNewReducer}
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export const createIfNew = createIfNewReducer();

/**
 * Returns a reducer that will create items if they don't already exist in the state,
 * using a custom creator function. The default creator uses the item as-is. If
 * all items already exist, the same state is returned. This is the safe version
 * of {@link createAllReducer}
 * @summary produces custom create-many-if-new reducer, with custom creator funciton
 * @see createAllReducer
 * @param {function} creator custom creator function, defaults to item => item
 * @return {function} create reducer
 */
export function createAllIfNewReducer(creator = defaultCreator) {
  const createAll = createAllReducer(creator);

  return function createAllIfNew(state, action) {
    return createAll(state, actionFilterUnknown(state, action));
  };
}

/**
 * @function createAllIfNew
 * Default reducer created by {@link createAllIfNewReducer}
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export const createAllIfNew = createAllIfNewReducer();

/**
 * Replaces an item in the state iff it already exists. Returns the same state
 * otherwise. This is the safe version of {@link replace}
 * @summary replaces existing items in the state
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 */
export function replaceExisting(state, action) {
  return state.byId.hasOwnProperty(action.data.id)
    ? replace(state, action)
    : state;
}

/**
 * Replaces exsting items only in the state. Returns the same state
 * if action.data is an empty array or if none of the items exist.
 * This is the safe version of {@link replaceAll}
 * @summary replace many existing items in the state
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 */
export function replaceAllExisting(state, action) {
  return replaceAll(state, actionFilterKnown(state, action));
}

/**
 * Moves an item from action.from to action.to and returns the new state,
 * iff action.from exists in the state and action.to doesn't exist in the
 * state. Returns the same state otherwise.
 * @summary moves an item in the state, with guard conditions
 * @param {NormalizedState} state
 * @param {MoveAction} action
 * @return {NormalizedState} new state
 */
export function moveSafe(state, action) {
  return state.byId.hasOwnProperty(action.from) &&
    !state.byId.hasOwnProperty(action.to)
    ? move(state, action)
    : state;
}

/**
 * Creates a reducer capable of handling
 * Normalizr data ({@link https://github.com/paularmstrong/normalizr}). Since
 * the data returned from the normalize function can contain multiple entities,
 * multiple reducers must be created for each entity schema, since each reducer
 * will update only one entity type in the state.
 * @param {string} key the entity type, as it appears under entities returned
 * by the normalize function
 * @param {function} reducer a reducer function used to process the resulting
 * data, by default addOrMergeAll. The reducer must be able to handle an
 * {@link ArrayAction}.
 */
export function updateNormalizedReducer(key, reducer = addOrMergeAll) {
  return function updateNormalized(state, action) {
    return reducer(state, { data: Object.values(action.data.entities[key]) });
  };
}

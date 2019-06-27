import {
  add,
  addAll,
  createReducer,
  createAllReducer,
  mergeReducer,
  mergeAllReducer,
  move,
  replace,
  replaceAll
} from "./reducers";

import { filterKnownData, filterUnknownData } from "./util";

/**
 * General exception thrown if one of the reducer constraints is violated.
 * A trivial extension of Error to enable catching.
 * @example <caption>Try-catch with reducer</caption>
 * let state = { allIds: ['x'], byId: { x: { id: 'x' } } }
 * try {
 *   addOrThrow(state, { data: { id: 'x' } })
 * } catch (e) {
 *   if (e instanceof ReducerError) {
 *     console.error(e)
 *   } else {
 *     throw e
 *   }
 * }
 */
export class ReducerError extends Error {}

/**
 * Adds action.data to the state, or throws if item already exists
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if item already exists
 */
export function addOrThrow(state, action) {
  if (state.byId.hasOwnProperty(action.data.id)) {
    throw new ReducerError(`can't add id ${action.data.id}: already exists`);
  }

  return add(state, action);
}

/**
 * Adds items to the state, or throws if any item already exists
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if item already exists
 */
export function addAllOrThrow(state, action) {
  let existing = filterKnownData(state, action.data).map(x => x.id);

  if (existing.length) {
    throw new ReducerError(
      `can't add ids ${existing.join(", ")}: they already exist`
    );
  }

  return addAll(state, action);
}

/**
 * Returns a reducer that creates action.data in the state, or throws
 * if item already exists. May provide a custom creator function.
 * @param {function} creator
 * @return {function} reducer
 */
export function createOrThrowReducer(creator) {
  let create = createReducer(creator);

  return function createOrThrow(state, action) {
    if (state.byId.hasOwnProperty(action.data.id)) {
      throw new ReducerError(
        `can't create id ${action.data.id}: already exists`
      );
    }
    return create(state, action);
  };
}

/**
 * @function createOrThrow
 * Adds action.data to the state, or throws if item already exists
 * @see createOrThrowReducer
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if item already exists
 */
export const createOrThrow = createOrThrowReducer();

/**
 * Returns a reducer that creates all items action.data in the state, or throws
 * if any already exists. May provide a custom creator function.
 * @param {function} creator
 * @return {function} reducer
 */
export function createAllOrThrowReducer(creator) {
  let createAll = createAllReducer(creator);

  return function createAllOrThrow(state, action) {
    let existing = filterKnownData(state, action.data).map(x => x.id);

    if (existing.length) {
      throw new ReducerError(
        `can't create ids ${existing.join(", ")}: they already exist`
      );
    }

    return createAll(state, action, creator);
  };
}

/**
 * @function createAllOrThrow
 * Adds action.data (array) to the state, or throws if item already exists. Returns
 * same state if action.data is empty.
 * @see createAllOrThrowReducer
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if any item already exists
 */
export const createAllOrThrow = createAllOrThrowReducer();

/**
 * Produces a merge reducer, that utilizes a custom function for merging data
 * (see {@link mergeReducer}). If any item to be merged doesn't exist, it throws
 * a {@link ReducerError}.
 * @summary produces a merge reducer with custom merge function
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function mergeOrThrowReducer(merger) {
  let merge = mergeReducer(merger);

  return function mergeOrThrow(state, action) {
    if (!state.byId.hasOwnProperty(action.data.id)) {
      throw new ReducerError(`can't merge id ${action.data.id}: not found`);
    }

    return merge(state, action);
  };
}

/**
 * @function mergeOrThrow
 * Merges action.data (object) to the state, or throws if item doesn't exist
 * @see mergeOrThrowReducer
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if item doesn't exist
 */
export const mergeOrThrow = mergeOrThrowReducer();

/**
 * Produces an mergeAll reducer, which may use a custom merge function.
 * The reducer throws if any item being merged doesn't exist.
 * @summary produces reducer for merging many items, w/custom merge function
 * @param {function} merger function with signature merge(existing, update)
 * @return {function} reducer
 */
export function mergeAllOrThrowReducer(merger) {
  let mergeAll = mergeAllReducer(merger);

  return function mergeAllOrThrow(state, action) {
    let notExisting = filterUnknownData(state, action.data).map(x => x.id);

    if (notExisting.length) {
      throw new ReducerError(
        `can't merge ids ${notExisting.join(", ")}: they're not found`
      );
    }

    return mergeAll(state, action);
  };
}

/**
 * @function mergeAllOrThrow
 * Merges items in action.data (array) to the state, or throws if any item doesn't
 * exist
 * @see mergeAllOrThrowReducer
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if any item doesn't exist
 */
export const mergeAllOrThrow = mergeAllOrThrowReducer();

/**
 * Replaces action.data (object) in the state, or throws if item doesn't exist
 * @param {NormalizedState} state
 * @param {DataAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if item doesn't exist
 */
export function replaceOrThrow(state, action) {
  if (!state.byId.hasOwnProperty(action.data.id)) {
    throw new ReducerError(`can't replace id ${action.data.id}: not found`);
  }

  return replace(state, action);
}

/**
 * Replaces items in action.data (array) to the state, or throws if any item doesn't
 * exist
 * @param {NormalizedState} state
 * @param {ArrayAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if any item doesn't exist
 */
export function replaceAllOrThrow(state, action) {
  let notExisting = filterUnknownData(state, action.data).map(x => x.id);

  if (notExisting.length) {
    throw new ReducerError(
      `can't replace ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return replaceAll(state, action);
}

/**
 * Move an item. Throws if the source doesn't exist, or the destination already exists.
 * @summary move an exsiting item in the state
 * @see move
 * @param {NormalizedState} state
 * @param {MoveAction} action
 * @return {NormalizedState} new state
 * @throws {ReducerError} if any item doesn't exist
 */
export function moveOrThrow(state, action) {
  let { from, to } = action;

  if (!state.byId.hasOwnProperty(from)) {
    throw new ReducerError(`can't move id ${from} to ${to}: ${from} not found`);
  }

  if (state.byId.hasOwnProperty(to)) {
    throw new ReducerError(
      `can't move id ${from} to ${to}: ${to} already exists`
    );
  }

  return move(state, action);
}

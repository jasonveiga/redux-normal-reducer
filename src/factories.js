import {
  ALL_ACTION_TYPES,
  ADD,
  ADD_ALL,
  CREATE,
  CREATE_ALL,
  MERGE,
  MERGE_ALL,
  REPLACE,
  REPLACE_ALL,
  MOVE,
  actionReducers
} from "./actions";

import {
  addOrThrow,
  addAllOrThrow,
  createOrThrow,
  createAllOrThrow,
  mergeOrThrow,
  mergeAllOrThrow,
  replaceOrThrow,
  replaceAllOrThrow,
  moveOrThrow
} from "./throwing-reducers";

/**
 * Produces a reducer that maps the basic reducers to action types. Action types
 * can be customized with a prefix and a suffix, and action creators will be named
 * accordingly, with the all-caps, undercase action types translated to camelCase
 * function names, e.g. ADD_USER => addUser. Action type unknown to the reducer
 * will be ignored, and the state returned unmodified. You can use the factory-
 * produced reducer on its own, or inside of your own reducer as part of a larger
 * switch/if-else tree.
 *
 * @example <caption>reducer with default values</caption>
 * import { reducer } from 'redux-normal-reducer'
 * const users = reducer()
 *
 * // Elsewhere in your code...
 * import { combineReducers } from 'redux'
 * import { users } from './users'
 *
 * const myStore = combineReducers({ users })
 *
 * @example <caption>reducer with customization</caption>
 * import { reducer, createReducer, mergeReducer } from 'redux-normal-reducer'
 *
 * // Customized create and merge reducers
 * const creator = user => ({
 *   createdOn: new Date().toISOString(),
 *   ...user
 * })
 *
 * const merger = (existing, update) => ({
 *   ...existing, ...update, updatedOn: new Date().toISOString(),
 * })
 *
 * const users = reducer({
 *   prefix: 'USERS_',
 *   customReducers: {
 *     USERS_CREATE: createReducer(creator),
 *     USERS_MERGE: mergeReducer(merger),
 *     USERS_TOTALLY_CUSTOM_ACTION_1: myCustomReducer1,
 *     USERS_TOTALLY_CUSTOM_ACTION_2: myCustomReducer2
 *   }
 * })
 *
 * // Elsewhere in your code...
 * import { combineReducers } from 'redux'
 * import { users } from './users'
 *
 * const myStore = combineReducers({ users })
 *
 * @param {object} config reducer configuration
 * @param {string} config.prefix prefix for action types, e.g. "MY_", "USER_"
 * @param {string} config.suffix suffix for action types, e.g. "_MY", "_USER"
 * @param {string} config.customReducers mapping of custom reducers to action types,
 *     will override the defaults reducer
 * @param {NormalizedState} config.defaultState default state object to use
 */
export function reducer({
  prefix = "",
  suffix = "",
  customReducers = {},
  defaultState = { allIds: [], byId: {} }
} = {}) {
  let mapping = ALL_ACTION_TYPES.reduce((mapping, type) => {
    mapping[prefix + type + suffix] = actionReducers[type];
    return mapping;
  }, {});

  mapping = { ...mapping, ...customReducers };

  return (state = defaultState, action) =>
    mapping.hasOwnProperty(action.type)
      ? mapping[action.type](state, action)
      : state;
}

/**
 * Produces a reducer that uses the *OrThrow reducers to throw exceptions if
 * constraints are violated (i.e. the operations would produce undefined
 * results). Customization of {@link reducer}
 * @param {object} config reducer configuration
 * @param {string} config.prefix prefix for action types, e.g. "MY_", "USER_"
 * @param {string} config.suffix suffix for action types, e.g. "_MY", "_USER"
 * @param {string} config.customReducers mapping of custom reducers to action types,
 *     will override the defaults reducer
 * @param {NormalizedState} config.defaultState default state object to use
 */
export function throwingReducer({
  prefix = "",
  suffix = "",
  customReducers = {},
  defaultState = { allIds: [], byId: {} }
} = {}) {
  customReducers = {
    [prefix + ADD + suffix]: addOrThrow,
    [prefix + ADD_ALL + suffix]: addAllOrThrow,
    [prefix + CREATE + suffix]: createOrThrow,
    [prefix + CREATE_ALL + suffix]: createAllOrThrow,
    [prefix + MERGE + suffix]: mergeOrThrow,
    [prefix + MERGE_ALL + suffix]: mergeAllOrThrow,
    [prefix + REPLACE + suffix]: replaceOrThrow,
    [prefix + REPLACE_ALL + suffix]: replaceAllOrThrow,
    [prefix + MOVE + suffix]: moveOrThrow,
    ...customReducers
  };

  return reducer({ prefix, suffix, customReducers, defaultState });
}

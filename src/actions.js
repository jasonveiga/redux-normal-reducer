import { underToCamel } from "./util";

import {
  add,
  addAll,
  addOrMerge,
  addOrMergeAll,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  createAllIfNew,
  createIfNew,
  merge,
  mergeAll,
  move,
  remove,
  removeAll,
  replace,
  replaceAll,
  replaceAllExisting,
  replaceExisting
} from "./reducers";

/** action type: add an item, data is an object */
export const ADD = "ADD";
/** action type: add an item, data is an array */
export const ADD_ALL = "ADD_ALL";
/** action type: add an item iff new, data is an object */
export const ADD_ALL_IF_NEW = "ADD_ALL_IF_NEW";
/** action type: add items iff new, data is an array */
export const ADD_IF_NEW = "ADD_IF_NEW";
/** action type: add or merge an item, data is an object */
export const ADD_OR_MERGE = "ADD_OR_MERGE";
/** action type: add or merge items, data is an array */
export const ADD_OR_MERGE_ALL = "ADD_OR_MERGE_ALL";
/** action type: add or replace an item, data is an object */
export const ADD_OR_REPLACE = "ADD_OR_REPLACE";
/** action type: add or replace items, data is an array */
export const ADD_OR_REPLACE_ALL = "ADD_OR_REPLACE_ALL";
/** action type: create an item, data is an object */
export const CREATE = "CREATE";
/** action type: create items, data is an array */
export const CREATE_ALL = "CREATE_ALL";
/** action type: create items iff they don't exist, data is an array */
export const CREATE_ALL_IF_NEW = "CREATE_ALL_IF_NEW";
/** action type: create an item iff it doesn't exist, data is an object */
export const CREATE_IF_NEW = "CREATE_IF_NEW";
/** action type: merge an item, data is an object */
export const MERGE = "MERGE";
/** action type: merge items, data is an array */
export const MERGE_ALL = "MERGE_ALL";
/** action type: move an item, from and to are ids */
export const MOVE = "MOVE";
/** action type: remove an item, id is the item to remove */
export const REMOVE = "REMOVE";
/** action type: remove items, ids conatain the item IDs to remove */
export const REMOVE_ALL = "REMOVE_ALL";
/** action type: replace item, data is an object */
export const REPLACE = "REPLACE";
/** action type: replace items, data is an array */
export const REPLACE_ALL = "REPLACE_ALL";
/** action type: replace items iff they exist, data is an array */
export const REPLACE_ALL_EXISTING = "REPLACE_ALL_EXISTING";
/** action type: replace item iff it exists, data is an object */
export const REPLACE_EXISTING = "REPLACE_EXISTING";
/** action type: update state using data from normalizr.normalize */
export const UPDATE_NORMALIZED = "UPDATE_NORMALIZED";

export const ALL_ACTION_TYPES = [
  ADD,
  ADD_ALL,
  ADD_ALL_IF_NEW,
  ADD_IF_NEW,
  ADD_OR_MERGE,
  ADD_OR_MERGE_ALL,
  ADD_OR_REPLACE,
  ADD_OR_REPLACE_ALL,
  CREATE,
  CREATE_ALL,
  CREATE_ALL_IF_NEW,
  CREATE_IF_NEW,
  MERGE,
  MERGE_ALL,
  MOVE,
  REMOVE,
  REMOVE_ALL,
  REPLACE,
  REPLACE_ALL,
  REPLACE_ALL_EXISTING,
  REPLACE_EXISTING,
  UPDATE_NORMALIZED
];

export const actionReducers = {
  [ADD]: add,
  [ADD_ALL]: addAll,
  [ADD_OR_MERGE]: addOrMerge,
  [ADD_OR_MERGE_ALL]: addOrMergeAll,
  [ADD_OR_REPLACE]: addOrReplace,
  [ADD_OR_REPLACE_ALL]: addOrReplaceAll,
  [CREATE]: create,
  [CREATE_ALL]: createAll,
  [CREATE_IF_NEW]: createIfNew,
  [CREATE_ALL_IF_NEW]: createAllIfNew,
  [MERGE]: merge,
  [MERGE_ALL]: mergeAll,
  [MOVE]: move,
  [REPLACE]: replace,
  [REPLACE_ALL]: replaceAll,
  [REMOVE]: remove,
  [REMOVE_ALL]: removeAll,
  [REPLACE_EXISTING]: replaceExisting,
  [REPLACE_ALL_EXISTING]: replaceAllExisting
};

export const DATA_ACTION_TYPES = [
  ADD,
  ADD_ALL,
  ADD_ALL_IF_NEW,
  ADD_IF_NEW,
  ADD_OR_MERGE,
  ADD_OR_MERGE_ALL,
  ADD_OR_REPLACE,
  ADD_OR_REPLACE_ALL,
  CREATE,
  CREATE_ALL,
  CREATE_ALL_IF_NEW,
  CREATE_IF_NEW,
  MERGE,
  MERGE_ALL,
  REPLACE,
  REPLACE_ALL,
  REPLACE_ALL_EXISTING,
  REPLACE_EXISTING,
  UPDATE_NORMALIZED
];

const dataActionCreatorFactory = type => data => ({ type, data });
const removeCreatorFactory = type => id => ({ type, id });
const removeAllCreatorFactory = type => ids => ({ type, ids });
const moveCreatorFactory = type => (from, to) => ({ type, from, to });

function addCreator(creators, type, prefix, suffix, factory) {
  type = prefix + type + suffix;
  let creatorName = underToCamel(type);
  let creator = factory(type);
  creators.creators[creatorName] = creator;
  creators.types[type] = type;
  return creators;
}

/**
 * @typedef NormalizedState
 * @type {Object}
 * @property {string[]} allIds contains all object ids in the state
 * @property {Object} byId contains data objects, keyed with their id
 */

/**
 * @typedef ActionMapping
 * @type {Object}
 * @property {Object} types keys and values are the action types, allowing
 *    easy destructuring onto local constants
 * @property {Object} creators keys are action creator function names,
 *    values are creator functions, allowing for destructuring onto local
 *    constants
 */

/**
 * @typedef DataItem
 * @type {Object}
 * @property {string} id must contain AT LEAST an id, may contain other keys
 */

/**
 * @typedef Action
 * @type {Object}
 * @property {string} type action type
 */

/**
 * @typedef DataAction
 * @type {Action}
 * @property {DataItem} data object containing an item with an id
 */

/**
 * @typedef ArrayAction
 * @type {Action}
 * @property {DataItem[]} data array containing multiple items
 */

/**
 * @typedef MoveAction
 * @type {Action}
 * @property {string} from source ID
 * @property {string} to destination ID
 */

/**
 * @typedef RemoveAction
 * @type {Action}
 * @property {string} id to remove
 */

/**
 * @typedef RemoveAllAction
 * @type {Action}
 * @property {string[]} ids to remove
 */

/**
 * Produces action creator functions, mapped with action types. You can
 * customize the type strings using the prefix and the suffix, which will
 * produce results like (e.g. with prefix="MY_" and suffix="_USERS"):
 * "ADD" => "MY_ADD_USERS"
 *
 * The resulting object contains the mapping of types to their string values,
 * under "types", and a mapping of action types to their creator method names,
 * under "creators".
 * @example <caption>Action mapping, uses only add and remove actions</caption>
 * import { actions } from 'redux-normal-reducer';
 * const mapping = actions({ prefix = "MY_" });
 * export const { MY_ADD, MY_REMOVE } = mapping.types;
 * export const { myAdd, myRemove } = mapping.creators;
 *
 * // Elsewhere in your code
 * import { myAdd, myRemove } from './custom-actions'
 * @param {object} config action config)
 * @param {string} config.prefix prefix for action types, e.g. "MY_", "USER_"
 * @param {string} config.suffix suffix for action types, e.g. "_MY", "_USER"
 * @return {ActionMapping}
 */
export function actions({ prefix = "", suffix = "" } = {}) {
  let creators = DATA_ACTION_TYPES.reduce(
    (creators, type) =>
      addCreator(creators, type, prefix, suffix, dataActionCreatorFactory),
    { types: {}, creators: {} }
  );

  creators = addCreator(
    creators,
    "REMOVE",
    prefix,
    suffix,
    removeCreatorFactory
  );

  creators = addCreator(
    creators,
    "REMOVE_ALL",
    prefix,
    suffix,
    removeAllCreatorFactory
  );

  creators = addCreator(creators, "MOVE", prefix, suffix, moveCreatorFactory);

  return creators;
}

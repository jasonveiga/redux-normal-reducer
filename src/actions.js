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

export const ADD = "ADD";
export const ADD_ALL = "ADD_ALL";
export const ADD_ALL_IF_NEW = "ADD_ALL_IF_NEW";
export const ADD_IF_NEW = "ADD_IF_NEW";
export const ADD_OR_MERGE = "ADD_OR_MERGE";
export const ADD_OR_MERGE_ALL = "ADD_OR_MERGE_ALL";
export const ADD_OR_REPLACE = "ADD_OR_REPLACE";
export const ADD_OR_REPLACE_ALL = "ADD_OR_REPLACE_ALL";
export const CREATE = "CREATE";
export const CREATE_ALL = "CREATE_ALL";
export const CREATE_ALL_IF_NEW = "CREATE_ALL_IF_NEW";
export const CREATE_IF_NEW = "CREATE_IF_NEW";
export const MERGE = "MERGE";
export const MERGE_ALL = "MERGE_ALL";
export const MOVE = "MOVE";
export const REMOVE = "REMOVE";
export const REMOVE_ALL = "REMOVE_ALL";
export const REPLACE = "REPLACE";
export const REPLACE_ALL = "REPLACE_ALL";
export const REPLACE_ALL_EXISTING = "REPLACE_ALL_EXISTING";
export const REPLACE_EXISTING = "REPLACE_EXISTING";

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
  REPLACE_EXISTING
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
  REPLACE_EXISTING
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

export default function actions({ prefix = "", suffix = "" } = {}) {
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

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

export function reducer({
  prefix = "",
  suffix = "",
  customReducers = {}
} = {}) {
  let mapping = ALL_ACTION_TYPES.reduce((mapping, type) => {
    mapping[prefix + type + suffix] = actionReducers[type];
    return mapping;
  }, {});

  mapping = { ...mapping, ...customReducers };

  return (state, action) =>
    mapping.hasOwnProperty(action.type)
      ? mapping[action.type](state, action)
      : state;
}

export function throwingReducer({
  prefix = "",
  suffix = "",
  customReducers = {}
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

  return reducer({ prefix, suffix, customReducers });
}

import {
  add,
  addAll,
  create,
  createAll,
  move,
  remove,
  removeAll,
  replace,
  replaceAll
} from "./reducers";

import { defaultCreator } from "./defaults";

import { filterKnownData, filterUnknownData } from "./util";

export const addIfNew = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? state : add(state, data);

export const addAllIfNew = (state, data) =>
  addAll(state, filterUnknownData(state, data));

export const createIfNew = (state, data, creator = defaultCreator) =>
  state.byId.hasOwnProperty(data.id) ? state : create(state, data, creator);

export const createAllIfNew = (state, data, creator = defaultCreator) =>
  createAll(state, filterUnknownData(state, data), creator);

export const replaceSafe = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? replace(state, data) : add(state, data);

export const replaceAllSafe = (state, data) =>
  replaceAll(
    addAll(state, filterUnknownData(state, data)),
    filterKnownData(state, data)
  );

export const moveSafe = (state, from, to) =>
  state.byId.hasOwnProperty(from) && !state.byId.hasOwnProperty(to)
    ? move(state, from, to)
    : state;

export const removeSafe = (state, id) =>
  state.byId.hasOwnProperty(id) ? remove(state, id) : state;

export const removeAllSafe = (state, ids) => {
  ids = ids.filter(id => state.byId.hasOwnProperty(id));
  return ids.length ? removeAll(state, ids) : state;
};

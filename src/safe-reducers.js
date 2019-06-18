import {
  add,
  addAll,
  create,
  createAll,
  merge,
  mergeAll,
  move,
  replace,
  replaceAll
} from "./reducers";

import { defaultCreator, shallowMerge } from "./defaults";

import { filterKnownData, filterUnknownData } from "./util";

export const addSafe = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? state : add(state, data);

export const addAllSafe = (state, data) =>
  addAll(state, filterUnknownData(state, data));

export const createSafe = (state, data, creator = defaultCreator) =>
  state.byId.hasOwnProperty(data.id) ? state : create(state, data, creator);

export const createAllSafe = (state, data, creator = defaultCreator) =>
  createAll(state, filterUnknownData(state, data), creator);

export const mergeSafe = (state, data, merger = shallowMerge) =>
  state.byId.hasOwnProperty(data.id)
    ? merge(state, data, merger)
    : add(state, data);

export const mergeAllSafe = (state, data, merger = shallowMerge) => {
  let unknown = filterUnknownData(state, data);
  let known = filterKnownData(state, data);
  state = unknown.length ? addAll(state, unknown) : state;
  return mergeAll(state, known, merger);
};

export const replaceSafe = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? replace(state, data) : add(state, data);

export const replaceAllSafe = (state, data) =>
  replaceAll(
    addAll(state, filterUnknownData(data)),
    filterKnownData(state, data)
  );

export const moveSafe = (state, from, to) =>
  state.byId.hasOwnProperty(from) && !state.byId.hasOwnProperty(to)
    ? move(state, from, to)
    : state;

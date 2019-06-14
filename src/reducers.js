import { defaultCreator, shallowMerge } from "./defaults";

export const add = (state, data) => ({
  ...state,
  allIds: [...state.allIds, data.id],
  byId: { ...state.byId, [data.id]: data }
});

export const addAll = (state, data) => ({
  ...state,
  allIds: [...state.allIds, ...data.map(x => x.id)],
  byId: data.reduce(
    (byId, x) => {
      byId[x.id] = x;
      return byId;
    },
    { ...state.byId }
  )
});

export const addOrReplace = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? replace(state, data) : add(state, data);

export function addOrReplaceAll(state, data) {
  let newIds = data
    .filter(x => !state.byId.hasOwnProperty(x.id))
    .map(x => x.id);

  let byId = data.reduce(
    (byId, x) => {
      byId[x.id] = x;
      return byId;
    },
    { ...state.byId }
  );

  return { ...state, allIds: [...state.allIds, ...newIds], byId };
}

export const create = (state, data, creator = defaultCreator) =>
  add(state, creator(data));

export function createAll(state, data, creator = defaultCreator) {
  data = data.map(creator);
  return {
    allIds: [...state.allIds, data.map(x => x.id)],
    byId: data.reduce((byId, x) => {
      byId[x.id] = x;
      return byId;
    }, state.byId)
  };
}

export const merge = (state, data, merger = shallowMerge) =>
  replace(state, merger(state.byId[data.id], data));

export const mergeAll = (state, data, merger = shallowMerge) =>
  replaceAll(state, data.map(x => merger(state.byId[x.id], x)));

export function move(state, from, to) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from] };
  delete byId[from];
  return { ...state, allIds, byId };
}

export const replace = (state, data) => ({
  ...state,
  byId: { ...state.byId, [data.id]: data }
});

export const replaceAll = (state, data) => ({
  ...state,
  byId: data.reduce(
    (byId, x) => {
      byId[x.id] = x;
      return byId;
    },
    { ...state.byId }
  )
});

export function remove(state, id) {
  let byId = { ...state.byId };
  delete byId[id];

  return {
    allIds: state.allIds.filter(i => i !== id),
    byId
  };
}

export function removeAll(state, ids) {
  ids = new Set(ids);
  let allIds = state.allIds.filter(i => !ids.has(i));

  let byId = allIds.reduce((byId, i) => {
    byId[i] = state.byId[i];
    return byId;
  }, {});

  return { ...state, allIds, byId };
}

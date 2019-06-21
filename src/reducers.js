import { defaultCreator, shallowMerge } from "./defaults";
import { filterKnownData, filterUnknownData, deleteKey } from "./util";

export const add = (state, data) => ({
  ...state,
  allIds: [...state.allIds, data.id],
  byId: { ...state.byId, [data.id]: data }
});

export const addAll = (state, data) =>
  data.length
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

export const addOrMerge = (state, data, merger = shallowMerge) =>
  state.byId.hasOwnProperty(data.id)
    ? merge(state, data, merger)
    : add(state, data);

export const addOrMergeAll = (state, data, merger = shallowMerge) =>
  mergeAll(
    addAll(state, filterUnknownData(state, data)),
    filterKnownData(state, data),
    merger
  );

export const addOrReplace = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? replace(state, data) : add(state, data);

export function addOrReplaceAll(state, data) {
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

export const create = (state, data, creator = defaultCreator) =>
  add(state, creator(data));

export function createAll(state, data, creator = defaultCreator) {
  if (!data.length) {
    return state;
  }

  data = data.map(creator);

  return {
    allIds: [...state.allIds, ...data.map(x => x.id)],
    byId: data.reduce(
      (byId, x) => {
        byId[x.id] = x;
        return byId;
      },
      { ...state.byId }
    )
  };
}

export const merge = (state, data, merger = shallowMerge) =>
  replace(state, merger(state.byId[data.id], data));

export const mergeAll = (state, data, merger = shallowMerge) =>
  replaceAll(state, data.map(x => merger(state.byId[x.id], x)));

export function move(state, from, to) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from], id: to };
  delete byId[from];
  return { ...state, allIds, byId };
}

export const replace = (state, data) => ({
  ...state,
  byId: { ...state.byId, [data.id]: data }
});

export const replaceAll = (state, data) =>
  data.length
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

export const remove = (state, id) =>
  state.byId.hasOwnProperty(id)
    ? {
        allIds: state.allIds.filter(i => i !== id),
        byId: deleteKey(state.byId, id)
      }
    : state;

export function removeAll(state, ids) {
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

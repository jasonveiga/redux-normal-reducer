import { defaultCreator, shallowMerge } from "./defaults";
import { filterKnownData, filterUnknownData, deleteKey } from "./util";

const actionFilterUnknown = (state, action) => ({
  data: action.data.filter(x => !state.byId.hasOwnProperty(x.id))
});

const actionFilterKnown = (state, action) => ({
  data: action.data.filter(x => state.byId.hasOwnProperty(x.id))
});

export const add = (state, { data }) => ({
  ...state,
  allIds: [...state.allIds, data.id],
  byId: { ...state.byId, [data.id]: data }
});

export const addAll = (state, { data }) =>
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

export const addOrMergeReducer = (merger = shallowMerge) => (state, action) =>
  state.byId.hasOwnProperty(action.data.id)
    ? merge(state, action, merger)
    : add(state, action);

export const addOrMerge = addOrMergeReducer();

export const addOrMergeAllReducer = (merger = shallowMerge) => (
  state,
  action
) =>
  mergeAll(
    addAll(state, actionFilterUnknown(state, action)),
    actionFilterKnown(state, action),
    merger
  );

export const addOrMergeAll = addOrMergeAllReducer();

export const addOrReplace = (state, action) =>
  state.byId.hasOwnProperty(action.data.id)
    ? replace(state, action)
    : add(state, action);

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

export const createReducer = (creator = defaultCreator) => (state, { data }) =>
  add(state, { data: creator(data) });

export const create = createReducer();

export const createAllReducer = (creator = defaultCreator) => (
  state,
  { data }
) => {
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
};

export const createAll = createAllReducer();

export const mergeReducer = (merger = shallowMerge) => (state, { data }) =>
  replace(state, { data: merger(state.byId[data.id], data) });

export const merge = mergeReducer();

export const mergeAllReducer = (merger = shallowMerge) => (state, { data }) =>
  replaceAll(state, { data: data.map(x => merger(state.byId[x.id], x)) });

export const mergeAll = mergeAllReducer();

export function move(state, { from, to }) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from], id: to };
  delete byId[from];
  return { ...state, allIds, byId };
}

export const replace = (state, { data }) => ({
  ...state,
  byId: { ...state.byId, [data.id]: data }
});

export const replaceAll = (state, { data }) =>
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

export const remove = (state, { id }) =>
  state.byId.hasOwnProperty(id)
    ? {
        allIds: state.allIds.filter(i => i !== id),
        byId: deleteKey(state.byId, id)
      }
    : state;

export function removeAll(state, { ids }) {
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

export const addIfNew = (state, action) =>
  state.byId.hasOwnProperty(action.data.id) ? state : add(state, action);

export const addAllIfNew = (state, action) =>
  addAll(state, actionFilterUnknown(state, action));

export function createIfNewReducer(creator = defaultCreator) {
  const create = createReducer(creator);

  return function createIfNew(state, action) {
    return state.byId.hasOwnProperty(action.data.id)
      ? state
      : create(state, action);
  };
}

export const createIfNew = createIfNewReducer();

export function createAllIfNewReducer(creator = defaultCreator) {
  const createAll = createAllReducer(creator);

  return function createAllIfNew(state, action) {
    return createAll(state, actionFilterUnknown(state, action));
  };
}

export const createAllIfNew = createAllIfNewReducer();

export const replaceExisting = (state, action) =>
  state.byId.hasOwnProperty(action.data.id) ? replace(state, action) : state;

export const replaceAllExisting = (state, action) =>
  replaceAll(state, actionFilterKnown(state, action));

export const moveSafe = (state, action) =>
  state.byId.hasOwnProperty(action.from) &&
  !state.byId.hasOwnProperty(action.to)
    ? move(state, action)
    : state;

const DEFAULT_ACTION_TYPES = {
  create: false,
  add: false,
  replace: false,
  move: false,
  addOrReplace: false,
  merge: false,
  remove: false
};

const DEFAULT_OPTIONS = { creator: defaultCreator, merger: shallowMerge };

function defaultCreator(data = {}) {
  return { ...data };
}

function shallowMerge(a, b) {
  return { ...a, ...b };
}

const add = (state, data) => ({
  ...state,
  allIds: [...state.allIds, data.id],
  byId: { ...state.byId, [data.id]: data }
});

const create = (state, data, creator) => add(state, creator(data));

const replace = (state, data) => ({
  ...state,
  byId: { ...state.byId, [data.id]: data }
});

const merge = (state, data, merger) =>
  replace(state, merger(state.byId[data.id], data));

function remove(state, id) {
  let byId = { ...state.byId };
  delete byId[id];

  return {
    allIds: state.allIds.filter(i => i !== id),
    byId
  };
}

function move(state, from, to) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from] };
  delete byId[from];
  return { ...state, allIds, byId };
}

export function reducer(
  actionTypes,
  defaultState = { allIds: [], byId: {} },
  options = DEFAULT_OPTIONS
) {
  actionTypes = { ...DEFAULT_ACTION_TYPES, ...actionTypes };
  options = { ...DEFAULT_OPTIONS, ...options };

  return (state = defaultState, action) => {
    switch (action.type) {
      case actionTypes.create:
        if (state.byId.hasOwnProperty(action.data.id)) {
          throw new Error(`can't create id ${action.data.id}: already exists`);
        }

        return create(state, action.data, options.creator);
      case actionTypes.add:
        if (state.byId.hasOwnProperty(action.data.id)) {
          throw new Error(`can't add id ${action.data.id}: already exists`);
        }

        return add(state, action.data);
      case actionTypes.replace:
        if (!state.byId.hasOwnProperty(action.data.id)) {
          throw new Error(`can't replace id ${action.data.id}: not found`);
        }

        return replace(state, action.data);
      case actionTypes.move:
        if (!state.byId.hasOwnProperty(action.from)) {
          throw new Error(
            `can't move id ${action.from} to ${action.to}: ${action.from} not found`
          );
        }
        if (state.byId.hasOwnProperty(action.to)) {
          throw new Error(
            `can't move id ${action.from} to ${action.to}: ${action.to} already exists`
          );
        }

        return move(state, action.from, action.to);
      case actionTypes.addOrReplace:
        if (state.byId.hasOwnProperty(action.data.id)) {
          return replace(state, action.data);
        } else {
          return add(state, action.data);
        }
      case actionTypes.merge:
        if (!state.byId.hasOwnProperty(action.data.id)) {
          throw new Error(`can't merge id ${action.data.id}: not found`);
        }

        return merge(state, action.data, options.merger);
      case actionTypes.remove:
        return remove(state, action.id);
      default:
        return state;
    }
  };
}

export const toArray = state => state.allIds.map(i => state.byId[i]);
export const map = (state, fn) => toArray(state).map(fn);
export const sort = (state, fn) => toArray(state).sort(fn);
export const sortIds = (state, fn) =>
  state.allIds.sort(fn).map(i => state.byId[i]);
export const forEach = (state, fn) => toArray(state).forEach(fn);
export const filter = (state, fn) => toArray(state).filter(fn);
export const filterIds = (state, fn) =>
  state.allIds.filter(fn).map(i => state.byId[i]);

const DEFAULT_ACTION_TYPES = {
  clear: false,
  create: false,
  createAll: false,
  add: false,
  addAll: false,
  replace: false,
  replaceAll: false,
  move: false,
  addOrReplace: false,
  addOrReplaceAll: false,
  merge: false,
  mergeAll: false,
  remove: false,
  removeAll: false
};

const DEFAULT_OPTIONS = {
  creator: defaultCreator,
  merger: shallowMerge,
  safe: {
    add: true,
    addAll: true,
    replace: true,
    replaceAll: true,
    move: true,
    merge: true,
    mergeAll: true
  }
};

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

function addSafe(state, data) {
  if (state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't add id ${data.id}: already exists`);
  }

  return add(state, data);
}

const addAll = (state, data) => ({
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

function addAllSafe(state, data) {
  let existing = data
    .filter(x => state.byId.hasOwnProperty(x.id))
    .map(x => x.id);

  if (existing.length) {
    throw new Error(`can't add ids ${existing.join(", ")}: they already exist`);
  }

  return addAll(state, data);
}

const create = (state, data, creator) => add(state, creator(data));

function createSafe(state, data, creator) {
  if (state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't create id ${data.id}: already exists`);
  }

  return create(state, data, creator);
}

function createAll(state, data, creator) {
  data = data.map(creator);
  return {
    allIds: [...state.allIds, data.map(x => x.id)],
    byId: data.reduce((byId, x) => {
      byId[x.id] = x;
      return byId;
    }, state.byId)
  };
}

function createAllSafe(state, data, creator) {
  let existing = data
    .filter(x => state.byId.hasOwnProperty(x.id))
    .map(x => x.id);

  if (existing.length) {
    throw new Error(
      `can't create ids ${existing.join(", ")}: they already exist`
    );
  }

  return createAll(state, data, creator);
}

const replace = (state, data) => ({
  ...state,
  byId: { ...state.byId, [data.id]: data }
});

function replaceSafe(state, data) {
  if (!state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't replace id ${data.id}: not found`);
  }

  return replace(state, data);
}

const replaceAll = (state, data) => ({
  ...state,
  byId: data.reduce(
    (byId, x) => {
      byId[x.id] = x;
      return byId;
    },
    { ...state.byId }
  )
});

function replaceAllSafe(state, data) {
  let notExisting = data
    .filter(x => !state.byId.hasOwnProperty(x.id))
    .map(x => x.id);

  if (notExisting.length) {
    throw new Error(
      `can't replace ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return replaceAll(state, data);
}

const addOrReplace = (state, data) =>
  state.byId.hasOwnProperty(data.id) ? replace(state, data) : add(state, data);

function addOrReplaceAll(state, data) {
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

const merge = (state, data, merger) =>
  replace(state, merger(state.byId[data.id], data));

function mergeSafe(state, data, merger) {
  if (!state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't merge id ${data.id}: not found`);
  }

  return merge(state, data, merger);
}

const mergeAll = (state, data, merger) =>
  replaceAll(state, data.map(x => merger(state.byId[x.id], x)));

function mergeAllSafe(state, data, merger) {
  let notExisting = data
    .filter(x => !state.byId.hasOwnProperty(x.id))
    .map(x => x.id);

  if (notExisting.length) {
    throw new Error(
      `can't merge ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return mergeAll(state, data, merger);
}

function remove(state, id) {
  let byId = { ...state.byId };
  delete byId[id];

  return {
    allIds: state.allIds.filter(i => i !== id),
    byId
  };
}

function removeAll(state, ids) {
  ids = new Set(ids);
  let allIds = state.allIds.filter(i => !ids.has(i));

  let byId = allIds.reduce((byId, i) => {
    byId[i] = state.byId[i];
    return byId;
  }, {});

  return { ...state, allIds, byId };
}

function move(state, from, to) {
  let allIds = state.allIds.filter(i => i !== from).concat([to]);
  let byId = { ...state.byId };
  byId[to] = { ...byId[from] };
  delete byId[from];
  return { ...state, allIds, byId };
}

function moveSafe(state, from, to) {
  if (!state.byId.hasOwnProperty(from)) {
    throw new Error(`can't move id ${from} to ${to}: ${from} not found`);
  }

  if (state.byId.hasOwnProperty(to)) {
    throw new Error(`can't move id ${from} to ${to}: ${to} already exists`);
  }

  return move(state, from, to);
}

export function reducer(
  actionTypes,
  defaultState = { allIds: [], byId: {} },
  options = DEFAULT_OPTIONS
) {
  actionTypes = { ...DEFAULT_ACTION_TYPES, ...actionTypes };
  options = { ...DEFAULT_OPTIONS, ...options };

  let reducers = {};

  if (options.safe === true) {
    reducers.create = createSafe;
    reducers.createAll = createAllSafe;
    reducers.add = addSafe;
    reducers.addAll = addAllSafe;
    reducers.replace = replaceSafe;
    reducers.replaceAllSafe = replaceAllSafe;
    reducers.move = moveSafe;
    reducers.merge = mergeSafe;
    reducers.mergeAll = mergeAllSafe;
  } else if (options.safe === false) {
    reducers.create = create;
    reducers.createAll = createAll;
    reducers.add = add;
    reducers.addAll = addAll;
    reducers.replace = replace;
    reducers.replaceAll = replaceAll;
    reducers.move = move;
    reducers.merge = merge;
    reducers.mergeAll = mergeAll;
  } else {
    reducers.create = options.safe.create ? createSafe : create;
    reducers.createAll = options.safe.createAll ? createAllSafe : createAll;
    reducers.add = options.safe.add ? addSafe : add;
    reducers.addAll = options.safe.addAll ? addAllSafe : addAll;
    reducers.replace = options.safe.replace ? replaceSafe : replace;
    reducers.replaceAll = options.safe.replaceAll ? replaceAllSafe : replaceAll;
    reducers.move = options.safe.move ? moveSafe : move;
    reducers.merge = options.safe.merge ? mergeSafe : merge;
    reducers.mergeAll = options.safe.mergeAll ? mergeAllSafe : mergeAll;
  }

  return (state = defaultState, action) => {
    switch (action.type) {
      case actionTypes.clear:
        return { ...state, allIds: [], byId: {} };
      case actionTypes.create:
        return reducers.create(state, action.data, options.creator);
      case actionTypes.createAll:
        return reducers.createAll(state, action.data, options.creator);
      case actionTypes.add:
        return reducers.add(state, action.data);
      case actionTypes.addAll:
        return reducers.addAll(state, action.data);
      case actionTypes.replace:
        return reducers.replace(state, action.data);
      case actionTypes.replaceAll:
        return reducers.replaceAll(state, action.data);
      case actionTypes.move:
        return reducers.move(state, action.from, action.to);
      case actionTypes.addOrReplace:
        return addOrReplace(state, action.data);
      case actionTypes.addOrReplaceAll:
        return addOrReplaceAll(state, action.data);
      case actionTypes.merge:
        return reducers.merge(state, action.data, options.merger);
      case actionTypes.mergeAll:
        return reducers.mergeAll(state, action.data, options.merger);
      case actionTypes.remove:
        return remove(state, action.id);
      case actionTypes.removeAll:
        return removeAll(state, action.id);
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

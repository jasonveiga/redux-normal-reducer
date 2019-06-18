export const filterKnownData = (state, data) =>
  data.filter(x => state.byId.hasOwnProperty(x.id));

export const filterUnknownData = (state, data) =>
  data.filter(x => !state.byId.hasOwnProperty(x.id));

export const toArray = state => state.allIds.map(i => state.byId[i]);

export const map = (state, fn) => toArray(state).map(fn);

export const sort = (state, fn) => toArray(state).sort(fn);

export const sortIds = (state, fn) =>
  state.allIds.sort(fn).map(i => state.byId[i]);

export const forEach = (state, fn) => toArray(state).forEach(fn);

export const filter = (state, fn) => toArray(state).filter(fn);

export const filterIds = (state, fn) =>
  state.allIds.filter(fn).map(i => state.byId[i]);

export const exists = (state, id) => state.byId.hasOwnProperty(id);

export const allExist = (state, ids) =>
  ids.filter(i => !exists(state, i)).length === 0;

export function anyExist(state, ids) {
  for (let i of ids) {
    if (exists(state, i)) {
      return true;
    }
  }
  return false;
}

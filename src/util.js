/**
 * Filters data, returns known items only
 * @param {NormalizedState} state normalized state to check in
 * @param {DataItem[]} data data to look for
 * @return {DataItem[]} data which exists
 */
export const filterKnownData = (state, data) =>
  data.filter(x => state.byId.hasOwnProperty(x.id));

/**
 * Filters data, returns known items only
 * @param {NormalizedState} state normalized state to check in
 * @param {DataItem[]} data data to look for
 * @return {DataItem[]} data which exists
 */
export const filterUnknownData = (state, data) =>
  data.filter(x => !state.byId.hasOwnProperty(x.id));

/**
 * Converts normalized state to an array of items
 * @param {NormalizedState} state
 * @return {DataItem[]} data items
 */
export const toArray = state => state.allIds.map(i => state.byId[i]);

/**
 * Maps fn onto {@link toArray}
 * @param {NormalizedState} state
 * @param {function} fn function to map
 * @return {array} array of mapped items
 */
export const map = (state, fn) => toArray(state).map(fn);

const defaultSorter = (a, b) => a.id.localeCompare(b.id);

/**
 * Sorts {@link toArray} using fn
 * @param {NormalizedState} state
 * @param {function} fn function to sort with
 * @return {DataItem[]} sorted data items
 */
export const sort = (state, fn = defaultSorter) => toArray(state).sort(fn);

/**
 * Calls fn on each item returned by {@link toArray}
 * @param {NormalizedState} state
 * @param {function} fn function to use
 */
export const forEach = (state, fn) => toArray(state).forEach(fn);

/**
 * Filters {@link toArray} using fn
 * @param {NormalizedState} state
 * @param {function} fn function to filter with
 * @return {DataItem[]} filtered data items
 */
export const filter = (state, fn) => toArray(state).filter(fn);

/**
 * Check whether id exists in state
 * @param {NormalizedState} state
 * @param {string} id id to check
 * @return {boolean} whether id exists
 */
export const exists = (state, id) => state.byId.hasOwnProperty(id);

/**
 * Check whether all ids exist in state
 * @param {NormalizedState} state
 * @param {string[]} ids ids to check
 * @return {boolean} whether all ids exist
 */
export const allExist = (state, ids) =>
  ids.filter(i => !exists(state, i)).length === 0;

/**
 * Check whether all any ids exist in state
 * @param {NormalizedState} state
 * @param {string[]} ids ids to check
 * @return {boolean} whether any ids exist
 */
export function anyExist(state, ids) {
  for (let i of ids) {
    if (exists(state, i)) {
      return true;
    }
  }
  return false;
}

export function deleteKey(obj, k) {
  if (obj.hasOwnProperty(k)) {
    obj = { ...obj };
    delete obj[k];
    return obj;
  } else {
    return obj;
  }
}

export const capitalize = x => x.charAt(0).toLocaleUpperCase() + x.slice(1);

export const underToCamel = x =>
  x
    .split("_")
    .map(y => y.toLocaleLowerCase())
    .map((y, i) => (i > 0 ? capitalize(y) : y))
    .join("");

import {
  add,
  addAll,
  addAllIfNew,
  addIfNew,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  createAllIfNew,
  createIfNew,
  merge,
  mergeAll,
  move,
  moveSafe,
  remove,
  removeAll,
  replace,
  replaceAll,
  replaceAllExisting,
  replaceExisting
} from "./reducers";

// import {
//   addIfNew,
//   addAllIfNew,
//   createIfNew,
//   createAllIfNew,
//   moveSafe,
//   replaceSafe,
//   replaceAllSafe
// } from "./safe-reducers";

import {
  filterKnownData,
  filterUnknownData,
  toArray,
  map,
  sort,
  sortIds,
  forEach,
  filter,
  filterIds
} from "./util";

// import { DEFAULT_OPTIONS, DEFAULT_ACTION_TYPES } from "./defaults";
//
// function reducer(
//   actionTypes,
//   defaultState = { allIds: [], byId: {} },
//   options = DEFAULT_OPTIONS
// ) {
//   actionTypes = { ...DEFAULT_ACTION_TYPES, ...actionTypes };
//   options = { ...DEFAULT_OPTIONS, ...options };
//
//   let reducers = {};
//
//   if (options.safe === true) {
//     reducers.create = createIfNew;
//     reducers.createAll = createAllIfNew;
//     reducers.add = addIfNew;
//     reducers.addAll = addAllIfNew;
//     reducers.replace = replaceSafe;
//     reducers.replaceAllSafe = replaceAllSafe;
//     reducers.move = moveSafe;
//     reducers.merge = merge;
//     reducers.mergeAll = mergeAll;
//   } else if (options.safe === false) {
//     reducers.create = create;
//     reducers.createAll = createAll;
//     reducers.add = add;
//     reducers.addAll = addAll;
//     reducers.replace = replace;
//     reducers.replaceAll = replaceAll;
//     reducers.move = move;
//     reducers.merge = merge;
//     reducers.mergeAll = mergeAll;
//   } else {
//     reducers.create = options.safe.create ? createIfNew : create;
//     reducers.createAll = options.safe.createAll ? createAllIfNew : createAll;
//     reducers.add = options.safe.add ? addIfNew : add;
//     reducers.addAll = options.safe.addAll ? addAllIfNew : addAll;
//     reducers.replace = options.safe.replace ? replaceSafe : replace;
//     reducers.replaceAll = options.safe.replaceAll ? replaceAllSafe : replaceAll;
//     reducers.move = options.safe.move ? moveSafe : move;
//     reducers.merge = merge;
//     reducers.mergeAll = mergeAll;
//   }
//
//   return (state = defaultState, action) => {
//     switch (action.type) {
//       case actionTypes.clear:
//         return { ...state, allIds: [], byId: {} };
//       case actionTypes.create:
//         return reducers.create(state, action.data, options.creator);
//       case actionTypes.createAll:
//         return reducers.createAll(state, action.data, options.creator);
//       case actionTypes.add:
//         return reducers.add(state, action.data);
//       case actionTypes.addAll:
//         return reducers.addAll(state, action.data);
//       case actionTypes.replace:
//         return reducers.replace(state, action.data);
//       case actionTypes.replaceAll:
//         return reducers.replaceAll(state, action.data);
//       case actionTypes.move:
//         return reducers.move(state, action.from, action.to);
//       case actionTypes.addOrReplace:
//         return addOrReplace(state, action.data);
//       case actionTypes.addOrReplaceAll:
//         return addOrReplaceAll(state, action.data);
//       case actionTypes.merge:
//         return reducers.merge(state, action);
//       case actionTypes.mergeAll:
//         return reducers.mergeAll(state, action);
//       case actionTypes.remove:
//         return remove(state, action.id);
//       case actionTypes.removeAll:
//         return removeAll(state, action.id);
//       default:
//         return state;
//     }
//   };
// }

export {
  add,
  addAll,
  addAllIfNew,
  addIfNew,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  createAllIfNew,
  createIfNew,
  filter,
  filterIds,
  filterKnownData,
  filterUnknownData,
  forEach,
  map,
  merge,
  mergeAll,
  move,
  moveSafe,
  remove,
  removeAll,
  replace,
  replaceAll,
  replaceAllExisting,
  replaceExisting,
  sort,
  sortIds,
  toArray
  // reducer
};

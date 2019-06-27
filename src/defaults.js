export function defaultCreator(data = {}) {
  return { ...data };
}

export function shallowMerge(a, b) {
  return { ...a, ...b };
}

// export const DEFAULT_ACTION_TYPES = {
//   clear: false,
//   create: false,
//   createAll: false,
//   add: false,
//   addAll: false,
//   replace: false,
//   replaceAll: false,
//   move: false,
//   addOrReplace: false,
//   addOrReplaceAll: false,
//   merge: false,
//   mergeAll: false,
//   remove: false,
//   removeAll: false
// };
//
// export const DEFAULT_OPTIONS = {
//   creator: defaultCreator,
//   merger: shallowMerge,
//   safe: {
//     add: true,
//     addAll: true,
//     replace: true,
//     replaceAll: true,
//     move: true,
//     merge: true,
//     mergeAll: true
//   }
// };

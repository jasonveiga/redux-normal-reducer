import {
  addRandKey,
  emptyState,
  modifyRandKey,
  randItems,
  randNamedData,
  removeRandKey,
  stateFromItems,
  testRefEq,
  testRefNe,
  testStateRefNe,
  testStateRefEq,
  randStringNot
} from "./lib";

import actions from "../actions";

let actionCreators = actions().creators;

const noDataTest = (reducer, ac) => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let next = reducer(state, ac([]));
  expect(next).toEqual(state);
  testStateRefEq(next, state);
};

export const addTest = add => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = add(state, actionCreators.add(allItems[2]));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
};

export const addAllTest = addAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 2));
  let ac = actionCreators.addAll;
  let next = addAll(state, ac(allItems.slice(2)));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  noDataTest(addAll, ac);
};

export const addOrMergeTest = addOrMerge => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = addOrMerge(state, actionCreators.addOrMerge(allItems[2]));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);

  let data = randNamedData(allItems[1].id);
  next = addOrMerge(next, actionCreators.addOrMerge(data));
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...data }, allItems[2]])
  );
  testStateRefNe(state, next);
};

export const addOrMergeAllTest = addOrMergeAll => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toMerge = randNamedData(allItems[1].id);
  let ac = actionCreators.addOrMergeAll;
  let next = addOrMergeAll(state, ac([toAdd, toMerge]));
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...toMerge }, allItems[2]])
  );
  testStateRefNe(state, next);
  noDataTest(addOrMergeAll, ac);
};

export const addOrReplaceTest = addOrReplace => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let next = addOrReplace(state, actionCreators.addOrReplace(toAdd));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  next = addOrReplace(next, actionCreators.addOrReplace(toReplace));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
};

export const addOrReplaceAllTest = addOrReplaceAll => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let ac = actionCreators.addOrReplaceAll;
  let next = addOrReplaceAll(state, ac([toAdd, toReplace]));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
  noDataTest(addOrReplaceAll, ac);
};

export const createTest = create => () => {
  let state = emptyState();
  let toCreate = randNamedData();
  let next = create(state, actionCreators.create(toCreate));
  expect(next).toEqual(stateFromItems([toCreate]));
  testStateRefNe(state, next);
};

export const createAllTest = createAll => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems.slice(0, 2));
  let ac = actionCreators.createAll;
  let next = createAll(state, ac(allItems.slice(2)));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  noDataTest(createAll, ac);
};

export const createCustomTest = createReducer => () => {
  let state = emptyState();
  let toCreate = { id: "foo", a: 1 };
  let creator = x => ({ b: 2, a: 5, ...x });
  let create = createReducer(creator);
  let next = create(state, actionCreators.create(toCreate));
  expect(next).toEqual(stateFromItems([{ ...toCreate, b: 2 }]));
  testStateRefNe(state, next);
};

export const createAllCustomTest = createAllReducer => () => {
  let state = emptyState();
  let toCreate = [{ id: "foo", a: 1 }, { id: "bar", b: 5 }];
  let creator = x => ({ b: 2, a: 5, ...x });
  let createAll = createAllReducer(creator);
  let next = createAll(state, actionCreators.createAll(toCreate), creator);
  expect(next).toEqual(
    stateFromItems([{ id: "foo", a: 1, b: 2 }, { id: "bar", a: 5, b: 5 }])
  );
  testStateRefNe(state, next);
};

export const mergeCustomTest = mergeReducer => () => {
  let merger = (a, b) => ({ ...b, ...a });
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...toModify, ...allItems[3] };
  let merge = mergeReducer(merger);
  let next = merge(state, actionCreators.merge(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
};

export const mergeTest = merge => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...allItems[3], ...toModify };
  let next = merge(state, actionCreators.merge(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
};

export const mergeAllTest = mergeAll => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = allItems
    .slice(2)
    .map(i => addRandKey(modifyRandKey(removeRandKey(i))));
  let merged = allItems.slice(2).map((x, i) => ({ ...x, ...toModify[i] }));
  let ac = actionCreators.mergeAll;
  let next = mergeAll(state, ac(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
  noDataTest(mergeAll, ac);
};

export const mergeAllCustomTest = mergeAllReducer => () => {
  let merger = (a, b) => ({ ...b, ...a });
  let mergeAll = mergeAllReducer(merger);
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = allItems
    .slice(2)
    .map(i => addRandKey(modifyRandKey(removeRandKey(i))));
  let merged = allItems.slice(2).map((x, i) => merger(x, toModify[i]));
  let next = mergeAll(state, actionCreators.mergeAll(toModify), merger);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const moveTest = move => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let from = allItems[1].id;
  let to = randStringNot(allItems.map(x => x.id));
  let next = move(state, actionCreators.move(from, to));
  let expected = stateFromItems([
    allItems[0],
    allItems[2],
    { ...allItems[1], id: to }
  ]);
  expect(next).toEqual(expected);
  testStateRefNe(state, next);
};

export const replaceTest = replace => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toReplace = { ...allItems[2], id: allItems[1].id };
  let next = replace(state, actionCreators.replace(toReplace));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const replaceAllTest = replaceAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let toReplace = [
    { ...allItems[3], id: allItems[1].id },
    { ...allItems[4], id: allItems[2].id }
  ];
  let ac = actionCreators.replaceAll;
  let next = replaceAll(state, ac(toReplace));
  expect(next).toEqual(
    stateFromItems([allItems[0], toReplace[0], toReplace[1]])
  );
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
  noDataTest(replaceAll, ac);
};

export const removeTest = remove => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let next = remove(state, actionCreators.remove(allItems[0].id));
  expect(next).toEqual(stateFromItems(allItems.slice(1)));
  testStateRefNe(state, next);
};

export const removeAllTest = removeAll => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let ac = actionCreators.removeAll;
  let next = removeAll(state, ac([allItems[0].id, allItems[2].id]));
  expect(next).toEqual(stateFromItems([allItems[1]]));
  testStateRefNe(state, next);
  noDataTest(removeAll, ac);
};

// export const addUnsafeTest = (add, cb) => () => {
//   let allItems = randItems(5);
//   let state = stateFromItems(allItems);
//   let toAdd = allItems[1];
//   cb(() => add(state, toAdd), allItems, toAdd, state);
// };
//
// export const addAllUnsafeTest = (addAll, cb) => () => {
//   let allItems = randItems(5);
//   let initItems = allItems.slice(0, 3);
//   let state = stateFromItems(initItems);
//   let toAdd = randItems(3).map((x, i) => ({ ...x, id: allItems[i + 1].id }));
//   cb(() => addAll(state, toAdd), initItems, toAdd, state);
// };
//
// export const createUnsafeTest = (create, cb) => () => {
//   let all = randItems(5);
//   let state = stateFromItems(all);
//   let toCreate = all[2];
//   cb(() => create(state, toCreate), all, toCreate, state);
// };
//
// export const createAllUnsafeTest = (createAll, cb, creator) => () => {
//   let allItems = randItems(5);
//   let initItems = allItems.slice(0, 3);
//   let state = stateFromItems(initItems);
//   let toAdd = randItems(3).map((x, i) => ({ ...x, id: allItems[i + 1].id }));
//   cb(() => createAll(state, toAdd, creator), initItems, toAdd, state);
// };
//
// export const mergeUnsafeTest = (merge, cb) => () => {
//   let all = randItems(5);
//   let state = stateFromItems(all.slice(0, 3));
//   let toMerge = all[4];
//   cb(() => merge(state, toMerge), all.slice(0, 3), toMerge, state);
// };
//
// export const mergeAllUnsafeTest = (mergeAll, cb, creator) => () => {
//   let allItems = randItems(5);
//   let initItems = allItems.slice(0, 3);
//   let state = stateFromItems(initItems);
//   let toMerge = randItems(3).map((x, i) => ({ ...x, id: allItems[i + 1].id }));
//   cb(() => mergeAll(state, toMerge, creator), initItems, toMerge, state);
// };
//
// export const replaceUnsafeTest = (replace, cb) => () => {
//   let allItems = randItems(5);
//   let state = stateFromItems(allItems);
//   let toReplace = randNamedData();
//   toReplace.id = randStringNot(allItems.map(x => x.id));
//   cb(() => replace(state, toReplace), allItems, toReplace, state);
// };
//
// export const replaceAllUnsafeTest = (replaceAll, cb) => () => {
//   let allItems = randItems(5);
//   let initItems = allItems.slice(0, 3);
//   let state = stateFromItems(initItems);
//   let toReplace = randItems(3).map((x, i) => ({
//     ...x,
//     id: allItems[i + 1].id
//   }));
//   cb(() => replaceAll(state, toReplace), initItems, toReplace, state);
// };
//
// export const moveUnsafeTest = (move, cb) => () => {
//   let allItems = randItems(3);
//   let state = stateFromItems(allItems);
//   let from = randStringNot(allItems.map(x => x.id));
//   let to = randStringNot(allItems.map(x => x.id).concat([from]));
//   cb(() => move(state, from, to), allItems, from, to, state);
// };
//
// export const removeUnsafeTest = (remove, cb) => () => {
//   let allItems = randItems(3);
//   let state = stateFromItems(allItems);
//   let toRemove = randStringNot(allItems.map(x => x.id));
//   cb(() => remove(state, toRemove), allItems, toRemove, state);
// };
//
// export const removeAllUnsafeTest = (removeAll, cb) => () => {
//   let allItems = randItems(5);
//   let initItems = allItems.slice(0, 3);
//   let state = stateFromItems(initItems);
//   let toRemove = allItems.slice(1, 4).map(x => x.id);
//   cb(() => removeAll(state, toRemove), allItems, toRemove, state);
// };

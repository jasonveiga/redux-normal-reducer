import {
  addRandKey,
  emptyState,
  modifyRandKey,
  randItems,
  randNamedData,
  randStringNot,
  removeRandKey,
  stateFromItems,
  testRefEq,
  testRefNe,
  testStateRefNe
} from "./lib";

export const addTest = add => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = add(state, allItems[2]);
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
};

export const addAllTest = addAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = addAll(state, allItems.slice(2));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
};

export const createTest = create => () => {
  let state = emptyState();
  let toCreate = randNamedData();
  let next = create(state, toCreate);
  expect(next).toEqual(stateFromItems([toCreate]));
  testStateRefNe(state, next);
};

export const createAllTest = createAll => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = createAll(state, allItems.slice(2));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
};

export const createCustomTest = create => () => {
  let state = emptyState();
  let toCreate = { id: "foo", a: 1 };
  let creator = x => ({ b: 2, a: 5, ...x });
  let next = create(state, toCreate, creator);
  expect(next).toEqual(stateFromItems([{ ...toCreate, b: 2 }]));
  testStateRefNe(state, next);
};

export const createAllCustomTest = createAll => () => {
  let state = emptyState();
  let toCreate = [{ id: "foo", a: 1 }, { id: "bar", b: 5 }];
  let creator = x => ({ b: 2, a: 5, ...x });
  let next = createAll(state, toCreate, creator);
  expect(next).toEqual(
    stateFromItems([{ id: "foo", a: 1, b: 2 }, { id: "bar", a: 5, b: 5 }])
  );
  testStateRefNe(state, next);
};

export const mergeTest = merge => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...allItems[3], ...toModify };
  let next = merge(state, toModify);
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
  let next = mergeAll(state, toModify);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
};

export const addUnsafeTest = (add, cb) => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems);
  let toAdd = allItems[1];
  cb(() => add(state, toAdd), allItems, toAdd, state);
};

export const addAllUnsafeTest = (addAll, cb) => () => {
  let allItems = randItems(5);
  let initItems = allItems.slice(0, 3);
  let state = stateFromItems(initItems);
  let toAdd = randItems(3).map((x, i) => ({ ...x, id: allItems[i + 1].id }));
  cb(() => addAll(state, toAdd), initItems, toAdd, state);
};

export const createUnsafeTest = (create, cb) => () => {
  let all = randItems(5);
  let state = stateFromItems(all);
  let toCreate = all[2];
  cb(() => create(state, toCreate), all, toCreate, state);
};

export const createAllUnsafeTest = (createAll, cb, creator) => () => {
  let allItems = randItems(5);
  let initItems = allItems.slice(0, 3);
  let state = stateFromItems(initItems);
  let toAdd = randItems(3).map((x, i) => ({ ...x, id: allItems[i + 1].id }));
  cb(() => createAll(state, toAdd, creator), initItems, toAdd, state);
};

export const mergeUnsafeTest = (merge, cb) => () => {
  let all = randItems(5);
  let state = stateFromItems(all.slice(0, 3));
  let toMerge = all[4];
  cb(() => merge(state, toMerge), all.slice(0, 3), toMerge, state);
};

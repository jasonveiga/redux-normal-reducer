import {
  add,
  addAll,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  merge
} from "../reducers";

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
  testStateRefNe
} from "./lib";

test("add reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = add(state, allItems[2]);
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
});

test("add all reducer", () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = addAll(state, allItems.slice(2));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
});

test("add/replace reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let next = addOrReplace(state, toAdd);
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  next = addOrReplace(next, toReplace);
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
});

test("add/replace all reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let next = addOrReplaceAll(state, [toAdd, toReplace]);
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
});

test("create reducer", () => {
  let state = emptyState();
  let toCreate = randNamedData();
  let next = create(state, toCreate);
  expect(next).toEqual(stateFromItems([toCreate]));
  testStateRefNe(state, next);
});

test("create all reducer", () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = createAll(state, allItems.slice(2));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
});

test("create custom creator", () => {
  let state = emptyState();
  let toCreate = { id: "foo", a: 1 };
  let creator = x => ({ b: 2, a: 5, ...x });
  let next = create(state, toCreate, creator);
  expect(next).toEqual(stateFromItems([{ ...toCreate, b: 2 }]));
  testStateRefNe(state, next);
});

test("create all custom creator", () => {
  let state = emptyState();
  let toCreate = [{ id: "foo", a: 1 }, { id: "bar", b: 5 }];
  let creator = x => ({ b: 2, a: 5, ...x });
  let next = createAll(state, toCreate, creator);
  expect(next).toEqual(
    stateFromItems([{ id: "foo", a: 1, b: 2 }, { id: "bar", a: 5, b: 5 }])
  );
  testStateRefNe(state, next);
});

test("merge reducer", () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...allItems[3], ...toModify };
  let next = merge(state, toModify);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
});

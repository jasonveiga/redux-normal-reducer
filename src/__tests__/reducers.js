import {
  add,
  addAll,
  addOrMerge,
  addOrMergeAll,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  merge,
  mergeAll,
  move,
  replace,
  replaceAll,
  remove,
  removeAll
} from "../reducers";

import {
  addRandKey,
  modifyRandKey,
  randItems,
  randNamedData,
  randStringNot,
  removeRandKey,
  stateFromItems,
  testRefEq,
  testRefNe,
  testStateRefEq,
  testStateRefNe
} from "./lib";

import {
  addTest,
  addAllTest,
  createTest,
  createAllTest,
  createCustomTest,
  createAllCustomTest,
  mergeTest,
  mergeAllTest
} from "./reducers-lib";

test("add reducer", addTest(add));

test("add all reducer", addAllTest(addAll));

test("add/merge reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toMerge = randNamedData(allItems[1].id);
  let next = addOrMerge(state, toAdd);
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  next = addOrMerge(next, toMerge);
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...toMerge }, allItems[2]])
  );
  testStateRefNe(state, next);
});

test("add/merge all reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toMerge = randNamedData(allItems[1].id);
  let next = addOrMergeAll(state, [toAdd, toMerge]);
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...toMerge }, allItems[2]])
  );
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

test("create reducer", createTest(create));

test("create all reducer", createAllTest(createAll));

test("create custom creator", createCustomTest(create));

test("create all custom creator", createAllCustomTest(createAll));

test("merge reducer", mergeTest(merge));

test("merge all reducer", mergeAllTest(mergeAll));

test("merge custom", () => {
  let merger = (a, b) => ({ ...b, ...a });
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...toModify, ...allItems[3] };
  let next = merge(state, toModify, merger);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
});

test("merge all custom", () => {
  let merger = (a, b) => ({ ...b, ...a });
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = allItems
    .slice(2)
    .map(i => addRandKey(modifyRandKey(removeRandKey(i))));
  let merged = allItems.slice(2).map((x, i) => merger(x, toModify[i]));
  let next = mergeAll(state, toModify, merger);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
});

test("move reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let from = allItems[1].id;
  let to = randStringNot(allItems.map(x => x.id));
  let next = move(state, from, to);
  let expected = stateFromItems([
    allItems[0],
    allItems[2],
    { ...allItems[1], id: to }
  ]);
  expect(next).toEqual(expected);
  testStateRefNe(state, next);
});

test("replace reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toReplace = { ...allItems[2], id: allItems[1].id };
  let next = replace(state, toReplace);
  expect(next).toEqual(stateFromItems([allItems[0], toReplace]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
});

test("replace all reducer", () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let toReplace = [
    { ...allItems[3], id: allItems[1].id },
    { ...allItems[4], id: allItems[2].id }
  ];
  let next = replaceAll(state, toReplace);
  expect(next).toEqual(
    stateFromItems([allItems[0], toReplace[0], toReplace[1]])
  );
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
});

test("remove reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let next = remove(state, allItems[0].id);
  expect(next).toEqual(stateFromItems(allItems.slice(1)));
  testStateRefNe(state, next);
});

test("remove all reducer", () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let next = removeAll(state, [allItems[0].id, allItems[2].id]);
  expect(next).toEqual(stateFromItems([allItems[1]]));
  testStateRefNe(state, next);
});

let arrayReducers = [
  addAll,
  addOrMergeAll,
  addOrReplaceAll,
  createAll,
  mergeAll,
  replaceAll,
  removeAll
];

arrayReducers.forEach(reducer =>
  test(`${reducer.name} returns same state with no data passed in`, () => {
    let allItems = randItems(3);
    let state = stateFromItems(allItems);
    let next = reducer(state, []);
    expect(next).toEqual(state);
    testStateRefEq(next, state);
  })
);

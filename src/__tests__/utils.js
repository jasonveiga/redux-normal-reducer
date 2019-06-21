import {
  filterKnownData,
  filterUnknownData,
  toArray,
  map,
  sort,
  forEach,
  filter,
  exists,
  allExist,
  anyExist,
  deleteKey
} from "../util";

import {
  randItems,
  randNamedData,
  stateFromItems,
  testRefEq,
  testRefNe
} from "./lib";

test("filter known data", () => {
  let all = randItems(5);
  let state = stateFromItems(all.slice(0, 3));
  expect(filterKnownData(state, all.slice(1, 4))).toEqual(all.slice(1, 3));
});

test("filter unknown data", () => {
  let all = randItems(5);
  let state = stateFromItems(all.slice(0, 3));
  expect(filterUnknownData(state, all.slice(1, 4))).toEqual(all.slice(3, 4));
});

test("convert state to array", () => {
  let all = randItems(5);
  let state = stateFromItems(all);
  expect(toArray(state)).toEqual(all);
});

test("map state with a function", () => {
  let all = randItems(5);
  let fn = x => ({ ...x, a: 123 });
  let mapped = all.map(fn);
  let state = stateFromItems(all);
  expect(map(state, fn)).toEqual(mapped);
});

test("sort state data using default sort", () => {
  let all = randItems(5);
  let fn = (a, b) => a.id.localeCompare(b.id);
  let sorted = all.sort(fn);
  let state = stateFromItems(all);
  expect(sort(state)).toEqual(sorted);
});

test("sort state data using custom sort", () => {
  let all = randItems(5);
  let fn = (a, b) => b.id.localeCompare(a.id);
  let sorted = all.sort(fn);
  let state = stateFromItems(all);
  expect(sort(state, fn)).toEqual(sorted);
});

test("call function for state items", () => {
  // The forEach function will gather the sorted keys of each state item into
  // a 2-d array
  let all = randItems(5);
  let actualKeys = [];
  let expectedKeys = [];
  let factory = keys => () => x => keys.push(Object.keys(x).sort());
  let expected = all.forEach(factory(expected));
  let state = stateFromItems(all);
  forEach(state, factory(actualKeys));
  expect(expectedKeys).toEqual(actualKeys);
});

test("filter state items", () => {
  let all = randItems(5);
  let fn = (x, i) => i > 2;
  let filtered = all.filter(fn);
  let state = stateFromItems(all);
  expect(filter(state, fn)).toEqual(filtered);
});

test("check whether item exists in state (true)", () => {
  let all = randItems(5);
  expect(exists(stateFromItems(all), all[1].id)).toEqual(true);
});

test("check whether item exists in state (false)", () => {
  let all = randItems(5);
  expect(exists(stateFromItems(all.slice(2)), all[1].id)).toEqual(false);
});

test("check whether all items exist in state (true)", () => {
  let all = randItems(5);
  expect(allExist(stateFromItems(all), all.map(x => x.id))).toEqual(true);
});

test("check whether all items exist in state (false)", () => {
  let all = randItems(5);
  expect(allExist(stateFromItems(all.slice(1)), all.map(x => x.id))).toEqual(
    false
  );
});

test("check whether any items exist in state (true)", () => {
  let all = randItems(5);
  expect(
    anyExist(stateFromItems(all.slice(2)), all.slice(0, 3).map(x => x.id))
  ).toEqual(true);
});

test("check whether any items exist in state (false)", () => {
  let all = randItems(5);
  expect(
    anyExist(stateFromItems(all.slice(3)), all.slice(0, 3).map(x => x.id))
  ).toEqual(false);
});

test("delete's existing key", () => {
  let obj = randNamedData();
  let expected = { ...obj };
  delete expected.id;
  let actual = deleteKey(obj, "id");
  expect(actual).toEqual(expected);
  testRefNe(obj, actual);
});

test("deleteKey doesn't modify object if key doesn't exist", () => {
  let obj = randNamedData();
  let expected = { ...obj };
  delete expected.id;
  let actual = deleteKey(obj, "x");
  expect(actual).toEqual(obj);
  testRefEq(obj, actual);
});

import {
  createAllReducer,
  createReducer,
  mergeAllReducer,
  mergeReducer,
  reducer,
  throwingReducer
} from "..";

import {
  addAllTest,
  addOrMergeAllTest,
  addOrMergeTest,
  addOrReplaceAllTest,
  addOrReplaceTest,
  addTest,
  createAllCustomTest,
  createAllTest,
  createCustomTest,
  createTest,
  mergeAllCustomTest,
  mergeAllTest,
  mergeCustomTest,
  mergeTest,
  moveTest,
  removeAllTest,
  removeTest,
  replaceAllTest,
  replaceTest
} from "./reducers-lib";

import { randState, testStateRefEq } from "./lib";

const standardTests = [
  addAllTest,
  addOrMergeAllTest,
  addOrMergeTest,
  addOrReplaceAllTest,
  addOrReplaceTest,
  addTest,
  createAllTest,
  createTest,
  mergeAllTest,
  mergeTest,
  moveTest,
  removeAllTest,
  removeTest,
  replaceAllTest,
  replaceTest
];

describe("factory reducer default actions", () => {
  var myReducer = reducer();

  for (let t of standardTests) {
    test(t.name, t(myReducer));
  }
});

const customTests = [
  createCustomTest,
  createAllCustomTest,
  mergeCustomTest,
  mergeAllCustomTest
];

describe("factory reducer with custom actions", () => {
  const reducers = [
    creator => reducer({ customReducers: { CREATE: createReducer(creator) } }),
    creator =>
      reducer({ customReducers: { CREATE_ALL: createAllReducer(creator) } }),
    merger => reducer({ customReducers: { MERGE: mergeReducer(merger) } }),
    merger =>
      reducer({ customReducers: { MERGE_ALL: mergeAllReducer(merger) } })
  ];

  customTests.forEach((t, i) => test(t.name, t(reducers[i])));
});

describe("factory throwing reducer default actions", () => {
  var myReducer = throwingReducer();

  for (let t of standardTests) {
    test(t.name, t(myReducer));
  }
});

test("factory reducer ignores unknown action types", () => {
  const state = randState();
  const myReducer = reducer();
  const next = myReducer(state, { type: "FOO", payload: "bar" });
  expect(next).toEqual(state);
  testStateRefEq(next, state);
});

test("factory reducer applies default state", () => {
  let state;
  const myReducer = reducer();
  const next = myReducer(state, { type: "FOO", payload: "bar" });
  expect(next).toEqual({ allIds: [], byId: {} });
});

test("factory reducer applies custom default state", () => {
  let state;
  let defaultState = { allIds: [], byId: {}, foo: 123 };
  const myReducer = reducer({ defaultState });
  const next = myReducer(state, { type: "FOO", payload: "bar" });
  expect(next).toEqual(defaultState);
  testStateRefEq(next, defaultState);
});

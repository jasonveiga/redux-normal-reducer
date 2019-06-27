import {
  addAllOrThrow,
  addOrThrow,
  createAllOrThrow,
  createAllOrThrowReducer,
  createOrThrow,
  createOrThrowReducer,
  mergeAllOrThrow,
  mergeAllOrThrowReducer,
  mergeOrThrow,
  mergeOrThrowReducer,
  moveOrThrow,
  replaceAllOrThrow,
  replaceOrThrow
} from "..";

import {
  addAllOrThrowTest,
  addOrThrowTest,
  createAllOrThrowTest,
  createOrThrowTest,
  mergeAllOrThrowTest,
  mergeOrThrowTest,
  moveOrThrowTest,
  replaceOrThrowTest,
  replaceAllOrThrowTest
} from "./throwing-reducers-lib";

import {
  addAllTest,
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
  replaceAllTest,
  replaceTest
} from "./reducers-lib";

describe("throwing reducers, non-throwing operations", () => {
  const tests = [
    addAllTest,
    addTest,
    createAllTest,
    createTest,
    mergeAllTest,
    mergeTest,
    moveTest,
    replaceAllTest,
    replaceTest
  ];

  const reducers = [
    addAllOrThrow,
    addOrThrow,
    createAllOrThrow,
    createOrThrow,
    mergeAllOrThrow,
    mergeOrThrow,
    moveOrThrow,
    replaceAllOrThrow,
    replaceOrThrow
  ];

  tests.forEach((t, i) => test(t.name, t(reducers[i])));
});

describe("throwing reducers, non-throwing, custom", () => {
  const tests = [
    createAllCustomTest,
    createCustomTest,
    mergeAllCustomTest,
    mergeCustomTest
  ];

  const reducers = [
    createAllOrThrowReducer,
    createOrThrowReducer,
    mergeAllOrThrowReducer,
    mergeOrThrowReducer
  ];

  tests.forEach((t, i) => test(t.name, t(reducers[i])));
});

describe("throwing reducers, throwing operations", () => {
  const tests = [
    addAllOrThrowTest,
    addOrThrowTest,
    createAllOrThrowTest,
    createOrThrowTest,
    mergeAllOrThrowTest,
    mergeOrThrowTest,
    moveOrThrowTest,
    replaceOrThrowTest,
    replaceAllOrThrowTest
  ];

  const reducers = [
    addAllOrThrow,
    addOrThrow,
    createAllOrThrow,
    createOrThrow,
    mergeAllOrThrow,
    mergeOrThrow,
    moveOrThrow,
    replaceOrThrow,
    replaceAllOrThrow
  ];

  tests.forEach((t, i) => test(t.name, t(reducers[i])));
});

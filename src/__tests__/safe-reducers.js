import {
  addSafe,
  addAllSafe,
  createSafe,
  createAllSafe,
  mergeSafe,
  mergeAllSafe,
  moveSafe,
  replaceSafe,
  replaceAllSafe,
  removeSafe,
  removeAll
} from "../safe-reducers";

import {
  addTest,
  addAllTest,
  createTest,
  createAllTest,
  createCustomTest,
  createAllCustomTest,
  mergeTest,
  mergeAllTest,
  addUnsafeTest,
  addAllUnsafeTest,
  createUnsafeTest,
  createAllUnsafeTest,
  mergeUnsafeTest
} from "./reducers-lib";

import { testStateRefEq, testStateRefNe, stateFromItems } from "./lib";

test("safe add normal", addTest(addSafe));
test("safe add all normal", addAllTest(addAllSafe));
test("safe create normal", createTest(createSafe));
test("safe create all normal", createAllTest(createAllSafe));
test("safe create custom creator normal", createCustomTest(createSafe));
test(
  "safe create all custom creator normal",
  createAllCustomTest(createAllSafe)
);
test("safe merge normal", mergeTest(mergeSafe));
test("safe merge all normal", mergeAllTest(mergeAllSafe));

test(
  "safe add ignore",
  addUnsafeTest(addSafe, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe add all ignore",
  addAllUnsafeTest(addAllSafe, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toAdd[2]])));
    testStateRefNe(state, n);
  })
);

test(
  "safe create ignore",
  createUnsafeTest(createSafe, (next, all, toCreate, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe create all ignore",
  createAllUnsafeTest(addAllSafe, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toAdd[2]])));
    testStateRefNe(state, n);
  })
);

test(
  "safe merge ignore",
  mergeUnsafeTest(mergeSafe, (next, all, toMerge, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toMerge])));
    testStateRefNe(state, n);
  })
);

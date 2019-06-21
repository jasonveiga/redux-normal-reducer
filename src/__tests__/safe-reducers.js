import {
  addIfNew,
  addAllIfNew,
  createIfNew,
  createAllIfNew,
  moveSafe,
  replaceSafe,
  replaceAllSafe,
  removeSafe,
  removeAllSafe
} from "../safe-reducers";

import {
  addTest,
  addAllTest,
  createTest,
  createAllTest,
  createCustomTest,
  createAllCustomTest,
  addUnsafeTest,
  addAllUnsafeTest,
  createUnsafeTest,
  createAllUnsafeTest,
  replaceUnsafeTest,
  replaceAllUnsafeTest,
  moveUnsafeTest,
  removeUnsafeTest,
  removeAllUnsafeTest
} from "./reducers-lib";

import { testStateRefEq, testStateRefNe, stateFromItems } from "./lib";

test("safe add normal", addTest(addIfNew));
test("safe add all normal", addAllTest(addAllIfNew));
test("safe create normal", createTest(createIfNew));
test("safe create all normal", createAllTest(createAllIfNew));
test("safe create custom creator normal", createCustomTest(createIfNew));
test(
  "safe create all custom creator normal",
  createAllCustomTest(createAllIfNew)
);

test(
  "safe add ignore",
  addUnsafeTest(addIfNew, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe add all ignore",
  addAllUnsafeTest(addAllIfNew, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toAdd[2]])));
    testStateRefNe(state, n);
  })
);

test(
  "safe create ignore",
  createUnsafeTest(createIfNew, (next, all, toCreate, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe create all ignore",
  createAllUnsafeTest(addAllIfNew, (next, all, toAdd, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toAdd[2]])));
    testStateRefNe(state, n);
  })
);

test(
  "safe replace not exists",
  replaceUnsafeTest(replaceSafe, (next, all, toReplace, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems(all.concat([toReplace])));
    testStateRefNe(state, n);
  })
);

test(
  "safe replace all not exists",
  replaceAllUnsafeTest(replaceAllSafe, (next, all, toReplace, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems([all[0], ...toReplace]));
    testStateRefNe(state, n);
  })
);

test(
  "safe move not exists",
  moveUnsafeTest(moveSafe, (next, all, from, to, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe remove not exists",
  removeUnsafeTest(removeSafe, (next, all, toRemove, state) => {
    let n = next();
    expect(n).toEqual(state);
    testStateRefEq(state, n);
  })
);

test(
  "safe remove all not existing",
  removeAllUnsafeTest(removeAllSafe, (next, all, toRemove, state) => {
    let n = next();
    expect(n).toEqual(stateFromItems([all[0]]));
    testStateRefNe(state, n);
  })
);

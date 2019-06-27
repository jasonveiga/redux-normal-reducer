import {
  add,
  addAll,
  addAllIfNew,
  addIfNew,
  addOrMerge,
  addOrMergeAll,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  createAllIfNew,
  createAllIfNewReducer,
  createAllReducer,
  createIfNew,
  createIfNewReducer,
  createReducer,
  merge,
  mergeAll,
  mergeAllReducer,
  mergeReducer,
  move,
  moveSafe,
  remove,
  removeAll,
  replace,
  replaceAll,
  replaceAllExisting,
  replaceExisting
} from "../reducers";

import {
  addAllTest,
  addAllIfNewTest,
  addIfNewTest,
  addOrMergeAllTest,
  addOrMergeTest,
  addOrReplaceAllTest,
  addOrReplaceTest,
  addTest,
  createAllCustomTest,
  createAllIfNewTest,
  createAllTest,
  createCustomTest,
  createIfNewTest,
  createTest,
  mergeAllCustomTest,
  mergeAllTest,
  mergeCustomTest,
  mergeTest,
  moveTest,
  moveSafeTest,
  removeAllTest,
  removeTest,
  replaceAllExistingTest,
  replaceAllTest,
  replaceExistingTest,
  replaceTest
} from "./reducers-lib";

describe("test normal reducers", () => {
  test("add", addTest(add));
  test("add all", addAllTest(addAll));
  test("add all if new (new)", addAllTest(addAllIfNew));
  test("add all if new (not new)", addAllIfNewTest(addAllIfNew));
  test("add if new (new)", addTest(addIfNew));
  test("add if new (not new)", addIfNewTest(addIfNew));
  test("add/merge", addOrMergeTest(addOrMerge));
  test("add/merge all", addOrMergeAllTest(addOrMergeAll));
  test("add/replace", addOrReplaceTest(addOrReplace));
  test("add/replace all", addOrReplaceAllTest(addOrReplaceAll));
  test("create", createTest(create));
  test("create all", createAllTest(createAll));
  test("create all if new (new)", createAllTest(createAllIfNew));
  test("create all if new (not new)", createAllIfNewTest(createAllIfNew));
  test("create custom all if new", createAllCustomTest(createAllIfNewReducer));
  test("create custom creator", createCustomTest(createReducer));
  test("create all custom creator", createAllCustomTest(createAllReducer));
  test("create if new", createIfNewTest(createIfNew));
  test("create if new (custom)", createCustomTest(createIfNewReducer));
  test("merge", mergeTest(merge));
  test("merge all", mergeAllTest(mergeAll));
  test("merge custom", mergeCustomTest(mergeReducer));
  test("merge all custom", mergeAllCustomTest(mergeAllReducer));
  test("move", moveTest(move));
  test("safe move (safe)", moveTest(moveSafe));
  test("safe move (unsafe)", moveSafeTest(moveSafe));
  test("replace", replaceTest(replace));
  test("replace all existing (existing)", replaceAllTest(replaceAllExisting));
  test(
    "replace all existing (not existing)",
    replaceAllExistingTest(replaceAllExisting)
  );
  test("replace all", replaceAllTest(replaceAll));
  test("replace existing (existing)", replaceTest(replaceExisting));
  test("replace existing (not existing)", replaceExistingTest(replaceExisting));
  test("remove", removeTest(remove));
  test("remove all", removeAllTest(removeAll));
});

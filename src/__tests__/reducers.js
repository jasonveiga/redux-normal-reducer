import {
  add,
  addAll,
  addOrMerge,
  addOrMergeAll,
  addOrReplace,
  addOrReplaceAll,
  create,
  createAll,
  createAllReducer,
  createReducer,
  merge,
  mergeAll,
  mergeAllReducer,
  mergeReducer,
  move,
  replace,
  replaceAll,
  remove,
  removeAll
} from "../reducers";

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

test("add reducer", addTest(add));
test("add all reducer", addAllTest(addAll));
test("add/merge reducer", addOrMergeTest(addOrMerge));
test("add/merge all reducer", addOrMergeAllTest(addOrMergeAll));
test("add/replace reducer", addOrReplaceTest(addOrReplace));
test("add/replace all reducer", addOrReplaceAllTest(addOrReplaceAll));
test("create reducer", createTest(create));
test("create all reducer", createAllTest(createAll));
test("create custom creator", createCustomTest(createReducer));
test("create all custom creator", createAllCustomTest(createAllReducer));
test("merge reducer", mergeTest(merge));
test("merge all reducer", mergeAllTest(mergeAll));
test("merge custom", mergeCustomTest(mergeReducer));
test("merge all custom", mergeAllCustomTest(mergeAllReducer));
test("move reducer", moveTest(move));
test("replace reducer", replaceTest(replace));
test("replace all reducer", replaceAllTest(replaceAll));
test("remove reducer", removeTest(remove));
test("remove all reducer", removeAllTest(removeAll));

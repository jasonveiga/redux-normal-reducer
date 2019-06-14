import { add, addAll, addOrReplace } from "../reducers";
import {
  randItems,
  randNamedData,
  stateFromItems,
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

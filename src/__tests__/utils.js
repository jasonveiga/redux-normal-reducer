import { filterKnownData, filterUnknownData } from "../util";
import { randItems, stateFromItems } from "./lib";

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

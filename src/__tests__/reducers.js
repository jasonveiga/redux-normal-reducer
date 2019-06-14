import { add } from "../reducers";
import { randItems, stateFromItems } from "./lib";

test("add reducer", () => {
  let allItems = randItems(3);
  let initState = stateFromItems(allItems.slice(0, 2));
  expect(add(initState, allItems[2])).toEqual(stateFromItems(allItems));
});

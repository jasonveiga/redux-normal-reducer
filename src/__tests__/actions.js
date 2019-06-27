import actions, {
  ALL_ACTION_TYPES,
  DATA_ACTION_TYPES,
  MOVE,
  REMOVE,
  REMOVE_ALL
} from "../actions";
import { underToCamel } from "../util";
import { randItems } from "./lib";

test("action types and creators map correctly", () => {
  let { types, creators } = actions();
  expect(Object.keys(types).sort()).toEqual(ALL_ACTION_TYPES.slice().sort());
  expect(Object.keys(creators).sort()).toEqual(
    ALL_ACTION_TYPES.map(underToCamel).sort()
  );

  ({ types, creators } = actions({ prefix: "FOO_" }));
  expect(Object.keys(types).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => "FOO_" + t).sort()
  );
  expect(Object.keys(creators).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => "FOO_" + t)
      .map(underToCamel)
      .sort()
  );

  ({ types, creators } = actions({ suffix: "_BAR" }));
  expect(Object.keys(types).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => t + "_BAR").sort()
  );
  expect(Object.keys(creators).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => t + "_BAR")
      .map(underToCamel)
      .sort()
  );

  ({ types, creators } = actions({ prefix: "FOO_", suffix: "_BAR" }));
  expect(Object.keys(types).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => "FOO_" + t + "_BAR").sort()
  );
  expect(Object.keys(creators).sort()).toEqual(
    ALL_ACTION_TYPES.map(t => "FOO_" + t + "_BAR")
      .map(underToCamel)
      .sort()
  );
});

test("action creators work correctly", () => {
  let { creators } = actions();
  let data = randItems;

  for (let type of DATA_ACTION_TYPES) {
    let c = underToCamel(type);
    expect(creators[c](data)).toEqual({ type, data });
  }

  expect(creators.move("a", 1)).toEqual({ type: MOVE, from: "a", to: 1 });
  expect(creators.remove(123)).toEqual({ type: REMOVE, id: 123 });
  let ids = [123, "abc"];
  expect(creators.removeAll(ids)).toEqual({ type: REMOVE_ALL, ids });
});

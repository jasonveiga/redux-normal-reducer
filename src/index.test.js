const normal = require("./index.js");

const CREATE = "CREATE";
const ADD = "ADD";
const REMOVE = "REMOVE";
const MOVE = "MOVE";
const MERGE = "MERGE";
const ACTION_TYPES = {
  create: CREATE,
  add: ADD,
  remove: REMOVE,
  move: MOVE,
  merge: MERGE
};

const emptyState = {
  allIds: [],
  byId: {}
};

const fooData = (foo = { name: "Foo" }) => ({
  ...foo,
  id: "foo"
});

const fooState = (foo = { name: "Foo" }) => ({
  allIds: ["foo"],
  byId: { foo: fooData(foo) }
});

const barData = (bar = { name: "Bar" }) => ({ ...bar, id: "bar" });

const barState = (bar = { name: "Bar" }) => ({
  allIds: ["bar"],
  byId: { bar: barData(bar) }
});

const fooBarState = () => ({
  allIds: ["foo", "bar"],
  byId: { foo: { id: "foo", name: "Foo" }, bar: { id: "bar", name: "Bar" } }
});

test("create action", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let data = { id: "foo", name: "Foo" };
  let next = reducer(emptyState, { type: CREATE, data });
  expect(next).toEqual(fooState());
  expect(next === emptyState).toBe(false);
});

test("add action", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let state = fooState();
  let data = barData();
  let next = reducer(state, { type: ADD, data });
  expect(next).toEqual(fooBarState());
  expect(next === state).toBe(false);
});

test("remove action", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let state = fooState();
  let next = reducer(state, { type: REMOVE, id: "foo" });
  expect(next).toEqual(emptyState);
  expect(next === state).toBe(false);
});

test("another remove action", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let state = fooBarState();
  let next = reducer(state, { type: REMOVE, id: "bar" });
  expect(next).toEqual(fooState());
  expect(next === state).toBe(false);
});

test("move an item", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let state = fooState();
  let next = reducer(state, { type: MOVE, from: "foo", to: "bar" });
  let expected = barState();
  expected.byId.bar = { ...state.byId.foo };
  expect(next).toEqual(expected);
  expect(next === state).toBe(false);
});

test("merge some data", () => {
  const reducer = normal.reducer(ACTION_TYPES);
  let initial = fooData({ a: 1, b: "two" });
  let state = fooState(initial);
  let update = fooData({ a: 2, c: true });
  let expected = fooState({ ...initial, ...update });
  let next = reducer(state, { type: MERGE, data: update });
  expect(next).toEqual(expected);
  expect(next === state).toBe(false);
});

import { actions, ReducerError } from "..";
import { randItems, stateFromItems } from "./lib";

let actionCreators = actions().creators;

export const addOrThrowTest = addOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all);
  expect(() => addOrThrow(state, actionCreators.add(all[1]))).toThrow(
    ReducerError
  );
};

export const addAllOrThrowTest = addAllOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() =>
    addAllOrThrow(state, actionCreators.addAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const createOrThrowTest = createOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all);
  expect(() => createOrThrow(state, actionCreators.create(all[1]))).toThrow(
    ReducerError
  );
};

export const createAllOrThrowTest = createAllOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() =>
    createAllOrThrow(state, actionCreators.createAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const mergeAllOrThrowTest = mergeAllOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() =>
    mergeAllOrThrow(state, actionCreators.mergeAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const mergeOrThrowTest = mergeOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() => mergeOrThrow(state, actionCreators.merge(all[3]))).toThrow(
    ReducerError
  );
};

export const moveOrThrowTest = moveOrThrow => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let from = allItems[3].id;
  let to = allItems[4].id;

  expect(() => moveOrThrow(state, actionCreators.move(from, to))).toThrow(
    ReducerError
  );

  from = allItems[2].id;
  to = allItems[1].id;

  expect(() => moveOrThrow(state, actionCreators.move(from, to))).toThrow(
    ReducerError
  );
};

export const replaceOrThrowTest = replaceOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() => replaceOrThrow(state, actionCreators.replace(all[3]))).toThrow(
    ReducerError
  );
};

export const replaceAllOrThrowTest = replaceAllOrThrow => () => {
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3));
  expect(() =>
    replaceAllOrThrow(state, actionCreators.replaceAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

import { actions, ReducerError } from "..";
import { randItems, stateFromItems, randExtra } from "./lib";

let actionCreators = actions().creators;

export const addOrThrowTest = addOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all, extra);
  expect(() => addOrThrow(state, actionCreators.add(all[1]))).toThrow(
    ReducerError
  );
};

export const addAllOrThrowTest = addAllOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() =>
    addAllOrThrow(state, actionCreators.addAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const createOrThrowTest = createOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all, extra);
  expect(() => createOrThrow(state, actionCreators.create(all[1]))).toThrow(
    ReducerError
  );
};

export const createAllOrThrowTest = createAllOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() =>
    createAllOrThrow(state, actionCreators.createAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const mergeAllOrThrowTest = mergeAllOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() =>
    mergeAllOrThrow(state, actionCreators.mergeAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

export const mergeOrThrowTest = mergeOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() => mergeOrThrow(state, actionCreators.merge(all[3]))).toThrow(
    ReducerError
  );
};

export const moveOrThrowTest = moveOrThrow => () => {
  let extra = randExtra();
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3), extra);
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
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() => replaceOrThrow(state, actionCreators.replace(all[3]))).toThrow(
    ReducerError
  );
};

export const replaceAllOrThrowTest = replaceAllOrThrow => () => {
  let extra = randExtra();
  let all = randItems();
  let state = stateFromItems(all.slice(0, 3), extra);
  expect(() =>
    replaceAllOrThrow(state, actionCreators.replaceAll(all.slice(2, 5)))
  ).toThrow(ReducerError);
};

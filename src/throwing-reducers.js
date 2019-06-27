import {
  add,
  addAll,
  createReducer,
  createAllReducer,
  mergeReducer,
  mergeAllReducer,
  move,
  replace,
  replaceAll
} from "./reducers";

import { filterKnownData, filterUnknownData } from "./util";

export class ReducerError extends Error {}

export function addOrThrow(state, action) {
  if (state.byId.hasOwnProperty(action.data.id)) {
    throw new ReducerError(`can't add id ${action.data.id}: already exists`);
  }

  return add(state, action);
}

export function addAllOrThrow(state, action) {
  let existing = filterKnownData(state, action.data).map(x => x.id);

  if (existing.length) {
    throw new ReducerError(
      `can't add ids ${existing.join(", ")}: they already exist`
    );
  }

  return addAll(state, action);
}

export function createOrThrowReducer(creator) {
  let create = createReducer(creator);

  return function createOrThrow(state, action) {
    if (state.byId.hasOwnProperty(action.data.id)) {
      throw new ReducerError(
        `can't create id ${action.data.id}: already exists`
      );
    }
    return create(state, action);
  };
}

export const createOrThrow = createOrThrowReducer();

export function createAllOrThrowReducer(creator) {
  let createAll = createAllReducer(creator);

  return function createAllOrThrow(state, action) {
    let existing = filterKnownData(state, action.data).map(x => x.id);

    if (existing.length) {
      throw new ReducerError(
        `can't create ids ${existing.join(", ")}: they already exist`
      );
    }

    return createAll(state, action, creator);
  };
}

export const createAllOrThrow = createAllOrThrowReducer();

export function mergeOrThrowReducer(merger) {
  let merge = mergeReducer(merger);

  return function mergeOrThrow(state, action) {
    if (!state.byId.hasOwnProperty(action.data.id)) {
      throw new ReducerError(`can't merge id ${action.data.id}: not found`);
    }

    return merge(state, action);
  };
}

export const mergeOrThrow = mergeOrThrowReducer();

export function mergeAllOrThrowReducer(merger) {
  let mergeAll = mergeAllReducer(merger);

  return function mergeAllOrThrow(state, action) {
    let notExisting = filterUnknownData(state, action.data).map(x => x.id);

    if (notExisting.length) {
      throw new ReducerError(
        `can't merge ids ${notExisting.join(", ")}: they're not found`
      );
    }

    return mergeAll(state, action);
  };
}

export const mergeAllOrThrow = mergeAllOrThrowReducer();

export function replaceOrThrow(state, action) {
  if (!state.byId.hasOwnProperty(action.data.id)) {
    throw new ReducerError(`can't replace id ${action.data.id}: not found`);
  }

  return replace(state, action);
}

export function replaceAllOrThrow(state, action) {
  let notExisting = filterUnknownData(state, action.data).map(x => x.id);

  if (notExisting.length) {
    throw new ReducerError(
      `can't replace ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return replaceAll(state, action);
}

export function moveOrThrow(state, action) {
  let { from, to } = action;

  if (!state.byId.hasOwnProperty(from)) {
    throw new ReducerError(`can't move id ${from} to ${to}: ${from} not found`);
  }

  if (state.byId.hasOwnProperty(to)) {
    throw new ReducerError(
      `can't move id ${from} to ${to}: ${to} already exists`
    );
  }

  return move(state, action);
}

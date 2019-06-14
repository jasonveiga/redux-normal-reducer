import {
  add,
  addAll,
  create,
  createAll,
  merge,
  mergeAll,
  move,
  replace,
  replaceAll
} from "./reducers";

import { filterKnownData, filterUnknownData } from "./util";

export function addOrThrow(state, data) {
  if (state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't add id ${data.id}: already exists`);
  }

  return add(state, data);
}

export function addAllOrThrow(state, data) {
  let existing = filterKnownData(state, data).map(x => x.id);

  if (existing.length) {
    throw new Error(`can't add ids ${existing.join(", ")}: they already exist`);
  }

  return addAll(state, data);
}

export function createOrThrow(state, data, creator) {
  if (state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't create id ${data.id}: already exists`);
  }

  return create(state, data, creator);
}

export function createAllOrThrow(state, data, creator) {
  let existing = filterKnownData(state, data).map(x => x.id);

  if (existing.length) {
    throw new Error(
      `can't create ids ${existing.join(", ")}: they already exist`
    );
  }

  return createAll(state, data, creator);
}

export function mergeOrThrow(state, data, merger) {
  if (!state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't merge id ${data.id}: not found`);
  }

  return merge(state, data, merger);
}

export function mergeAllOrThrow(state, data, merger) {
  let notExisting = filterUnknownData(state, data).map(x => x.id);

  if (notExisting.length) {
    throw new Error(
      `can't merge ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return mergeAll(state, data, merger);
}

export function replaceOrThrow(state, data) {
  if (!state.byId.hasOwnProperty(data.id)) {
    throw new Error(`can't replace id ${data.id}: not found`);
  }

  return replace(state, data);
}

export function replaceAllOrThrow(state, data) {
  let notExisting = filterUnknownData(state, data).map(x => x.id);

  if (notExisting.length) {
    throw new Error(
      `can't replace ids ${notExisting.join(", ")}: they're not found`
    );
  }

  return replaceAll(state, data);
}

export function moveOrThrow(state, from, to) {
  if (!state.byId.hasOwnProperty(from)) {
    throw new Error(`can't move id ${from} to ${to}: ${from} not found`);
  }

  if (state.byId.hasOwnProperty(to)) {
    throw new Error(`can't move id ${from} to ${to}: ${to} already exists`);
  }

  return move(state, from, to);
}

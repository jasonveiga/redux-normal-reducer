import {
  addRandKey,
  emptyState,
  modifyRandKey,
  randItems,
  randNamedData,
  removeRandKey,
  stateFromItems,
  testRefEq,
  testRefNe,
  testStateRefNe,
  testStateRefEq,
  randStringNot
} from "./lib";

import { actions } from "..";

let actionCreators = actions().creators;

const noDataTest = (reducer, ac) => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let next = reducer(state, ac([]));
  expect(next).toEqual(state);
  testStateRefEq(next, state);
};

export const addTest = add => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = add(state, actionCreators.add(allItems[2]));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
};

export const addAllIfNewTest = addAllIfNew => () => {
  let all = randItems(5);
  let init = all.slice(0, 3);
  let state = stateFromItems(init);
  let ac = actionCreators.addAllIfNew;
  let toAdd = [{ ...all[3], id: all[2].id }, all[4]];
  let next = addAllIfNew(state, ac(toAdd));
  expect(next).toEqual(stateFromItems(init.concat([all[4]])));
  testStateRefNe(state, next);
  noDataTest(addAllIfNew, ac);
};

export const addAllTest = addAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 2));
  let ac = actionCreators.addAll;
  let next = addAll(state, ac(allItems.slice(2)));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  noDataTest(addAll, ac);
};

export const addIfNewTest = addIfNew => () => {
  let all = randItems(5);
  let init = all.slice(0, 3);
  let state = stateFromItems(init);
  let ac = actionCreators.createIfNew;
  let toAdd = { ...all[3], id: all[2].id };
  let next = addIfNew(state, ac(toAdd));
  expect(next).toEqual(state);
  testStateRefEq(state, next);
};

export const addOrMergeTest = addOrMerge => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let next = addOrMerge(state, actionCreators.addOrMerge(allItems[2]));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);

  let data = randNamedData(allItems[1].id);
  next = addOrMerge(next, actionCreators.addOrMerge(data));
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...data }, allItems[2]])
  );
  testStateRefNe(state, next);
};

export const addOrMergeAllTest = addOrMergeAll => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toMerge = randNamedData(allItems[1].id);
  let ac = actionCreators.addOrMergeAll;
  let next = addOrMergeAll(state, ac([toAdd, toMerge]));
  expect(next).toEqual(
    stateFromItems([allItems[0], { ...allItems[1], ...toMerge }, allItems[2]])
  );
  testStateRefNe(state, next);
  noDataTest(addOrMergeAll, ac);
};

export const addOrReplaceTest = addOrReplace => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let next = addOrReplace(state, actionCreators.addOrReplace(toAdd));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  next = addOrReplace(next, actionCreators.addOrReplace(toReplace));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
};

export const addOrReplaceAllTest = addOrReplaceAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 2));
  let toAdd = allItems[2];
  let toReplace = randNamedData(allItems[1].id);
  let ac = actionCreators.addOrReplaceAll;
  let next = addOrReplaceAll(state, ac([toAdd, toReplace]));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace, allItems[2]]));
  testStateRefNe(state, next);
  noDataTest(addOrReplaceAll, ac);

  // All totally new items
  toAdd = allItems.slice(2);
  next = addOrReplaceAll(state, ac(toAdd));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);

  // All existing items (branch coverage)
  toReplace = [randNamedData(allItems[0].id)];
  next = addOrReplaceAll(state, ac(toReplace));
  expect(next).toEqual(stateFromItems([toReplace[0], allItems[1]]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const createIfNewTest = createIfNew => () => {
  let all = randItems(5);
  let init = all.slice(0, 3);
  let state = stateFromItems(init);
  let ac = actionCreators.createIfNew;
  let toCreate = { ...all[3], id: all[2].id };
  let next = createIfNew(state, ac(toCreate));
  expect(next).toEqual(state);
  testStateRefEq(state, next);
};

export const createTest = create => () => {
  let state = emptyState();
  let toCreate = randNamedData();
  let next = create(state, actionCreators.create(toCreate));
  expect(next).toEqual(stateFromItems([toCreate]));
  testStateRefNe(state, next);
};

export const createAllIfNewTest = createAllIfNew => () => {
  let all = randItems(5);
  let init = all.slice(0, 3);
  let state = stateFromItems(init);
  let ac = actionCreators.createAllIfNew;
  let toCreate = [{ ...all[3], id: all[2].id }, all[4]];
  let next = createAllIfNew(state, ac(toCreate));
  expect(next).toEqual(stateFromItems(init.concat([all[4]])));
  testStateRefNe(state, next);
  noDataTest(createAllIfNew, ac);
};

export const createAllTest = createAll => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems.slice(0, 2));
  let ac = actionCreators.createAll;
  let next = createAll(state, ac(allItems.slice(2)));
  expect(next).toEqual(stateFromItems(allItems));
  testStateRefNe(state, next);
  noDataTest(createAll, ac);
};

export const createCustomTest = createReducer => () => {
  let state = emptyState();
  let toCreate = { id: "foo", a: 1 };
  let creator = x => ({ b: 2, a: 5, ...x });
  let create = createReducer(creator);
  let next = create(state, actionCreators.create(toCreate));
  expect(next).toEqual(stateFromItems([{ ...toCreate, b: 2 }]));
  testStateRefNe(state, next);
};

export const createAllCustomTest = createAllReducer => () => {
  let state = emptyState();
  let toCreate = [{ id: "foo", a: 1 }, { id: "bar", b: 5 }];
  let creator = x => ({ b: 2, a: 5, ...x });
  let createAll = createAllReducer(creator);
  let next = createAll(state, actionCreators.createAll(toCreate), creator);
  expect(next).toEqual(
    stateFromItems([{ id: "foo", a: 1, b: 2 }, { id: "bar", a: 5, b: 5 }])
  );
  testStateRefNe(state, next);
};

export const mergeCustomTest = mergeReducer => () => {
  let merger = (a, b) => ({ ...b, ...a });
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...toModify, ...allItems[3] };
  let merge = mergeReducer(merger);
  let next = merge(state, actionCreators.merge(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
};

export const mergeTest = merge => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = addRandKey(modifyRandKey(removeRandKey(allItems[3])));
  let merged = { ...allItems[3], ...toModify };
  let next = merge(state, actionCreators.merge(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 3), merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
};

export const mergeAllTest = mergeAll => () => {
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = allItems
    .slice(2)
    .map(i => addRandKey(modifyRandKey(removeRandKey(i))));
  let merged = allItems.slice(2).map((x, i) => ({ ...x, ...toModify[i] }));
  let ac = actionCreators.mergeAll;
  let next = mergeAll(state, ac(toModify));
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefEq(state.allIds, next.allIds);
  testRefNe(state.byId, next.byId);
  noDataTest(mergeAll, ac);
};

export const mergeAllCustomTest = mergeAllReducer => () => {
  let merger = (a, b) => ({ ...b, ...a });
  let mergeAll = mergeAllReducer(merger);
  let allItems = randItems(4);
  let state = stateFromItems(allItems);
  let toModify = allItems
    .slice(2)
    .map(i => addRandKey(modifyRandKey(removeRandKey(i))));
  let merged = allItems.slice(2).map((x, i) => merger(x, toModify[i]));
  let next = mergeAll(state, actionCreators.mergeAll(toModify), merger);
  expect(next).toEqual(stateFromItems([...allItems.slice(0, 2), ...merged]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const moveTest = move => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems);
  let from = allItems[1].id;
  let to = randStringNot(allItems.map(x => x.id));
  let next = move(state, actionCreators.move(from, to));
  let expected = stateFromItems([
    allItems[0],
    allItems[2],
    { ...allItems[1], id: to }
  ]);
  expect(next).toEqual(expected);
  testStateRefNe(state, next);
};

export const moveSafeTest = moveSafe => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let from = allItems[3].id;
  let to = allItems[4].id;

  let next = moveSafe(state, actionCreators.move(from, to));
  expect(next).toEqual(state);
  testStateRefEq(next, state);

  from = allItems[2].id;
  to = allItems[1].id;
  next = moveSafe(state, actionCreators.move(from, to));
  expect(next).toEqual(state);
  testStateRefEq(next, state);
};

export const replaceTest = replace => () => {
  let allItems = randItems(3);
  let state = stateFromItems(allItems.slice(0, 2));
  let toReplace = { ...allItems[2], id: allItems[1].id };
  let next = replace(state, actionCreators.replace(toReplace));
  expect(next).toEqual(stateFromItems([allItems[0], toReplace]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const replaceAllTest = replaceAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let toReplace = [
    { ...allItems[3], id: allItems[1].id },
    { ...allItems[4], id: allItems[2].id }
  ];
  let ac = actionCreators.replaceAll;
  let next = replaceAll(state, ac(toReplace));
  expect(next).toEqual(
    stateFromItems([allItems[0], toReplace[0], toReplace[1]])
  );
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
  noDataTest(replaceAll, ac);
};

export const replaceAllExistingTest = replaceAllExisting => () => {
  let all = randItems();
  let init = all.slice(0, 3);
  let state = stateFromItems(init);
  let a = { ...all[3], id: all[1].id };
  let b = { ...all[4], id: all[3].id };
  let toReplace = [a, b];
  let next = replaceAllExisting(
    state,
    actionCreators.replaceAllExisting(toReplace)
  );
  expect(next).toEqual(stateFromItems([init[0], a, init[2]]));
  testRefNe(state, next);
  testRefNe(state.byId, next.byId);
  testRefEq(state.allIds, next.allIds);
};

export const replaceExistingTest = replaceExisting => () => {
  let allItems = randItems(5);
  let init = allItems.slice(0, 3);
  let state = stateFromItems(init);
  let toReplace = allItems[3];
  let next = replaceExisting(state, actionCreators.replace(toReplace));
  expect(next).toEqual(state);
  testStateRefEq(state, next);
};

export const removeTest = remove => () => {
  let allItems = randItems();
  let state = stateFromItems(allItems.slice(0, 3));
  let next = remove(state, actionCreators.remove(allItems[0].id));
  expect(next).toEqual(stateFromItems(allItems.slice(1, 3)));
  testStateRefNe(state, next);

  // Attempt to remove something that's not in the state, should be ignored
  next = remove(state, actionCreators.remove(allItems[3].id));
  expect(next).toEqual(state);
  testStateRefEq(state, next);
};

export const removeAllTest = removeAll => () => {
  let allItems = randItems(5);
  let state = stateFromItems(allItems.slice(0, 3));
  let ac = actionCreators.removeAll;
  let next = removeAll(state, ac([allItems[0].id, allItems[2].id]));
  expect(next).toEqual(stateFromItems([allItems[1]]));
  testStateRefNe(state, next);
  noDataTest(removeAll, ac);
  next = removeAll(state, ac([allItems[3].id, allItems[4].id]));
  expect(next).toEqual(state);
  testStateRefEq(state, next);
};

export const updateNormalizedTest = updateNormalizedReducer => () => {
  let data = {
    entities: {
      users: {
        "1": {
          id: "1",
          name: "Paul"
        },
        "2": {
          id: "2",
          name: "Nicole"
        },
        "3": {
          id: "3",
          name: "Steve"
        },
        "5": {
          id: "5",
          name: "Jane"
        }
      },
      comments: {
        "324": {
          id: "324",
          commenter: "2"
        },
        "325": {
          id: "325",
          commenter: "5"
        }
      },
      articles: {
        "123": {
          id: "123",
          author: "1",
          title: "My awesome blog post",
          comments: ["324"]
        },
        "124": {
          id: "124",
          author: "3",
          title: "My awesome blog post",
          comments: ["325"]
        }
      }
    },
    result: ["123", "124"]
  };

  let ac = actionCreators.updateNormalized;
  let updateNormalizedArticles = updateNormalizedReducer("articles");
  let updateNormalizedComments = updateNormalizedReducer("comments");
  let next = updateNormalizedArticles(emptyState(), ac(data));
  expect(next).toEqual(stateFromItems(Object.values(data.entities.articles)));
  next = updateNormalizedComments(emptyState(), ac(data));
  expect(next).toEqual(stateFromItems(Object.values(data.entities.comments)));
};

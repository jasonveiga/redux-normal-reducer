const foobar = [
  "foo",
  "bar",
  "baz",
  "qux",
  "quux",
  "quuz",
  "corge",
  "grault",
  "garply",
  "waldo",
  "fred",
  "plugh",
  "xyzzy",
  "thud"
];

const randInt = (max = 20, min = 0) => min + Math.floor(Math.random() * max);

const randString = (strings = foobar) => strings[randInt(strings.length)];

function randStringNot(not) {
  not = new Set(not);
  let fb = foobar.filter(x => !not.has(x));

  if (!fb.length) {
    throw new Error(`ran out of random strings not = ${not.join(", ")}`);
  }

  return randString(fb);
}

const randBool = () => Math.round() < 0.5;

const randGenerators = [randString, randInt, randBool];

const randData = () => randGenerators[randInt(randGenerators.length)]();

export const namedData = (id, data = {}) => ({
  id,
  name: id.charAt(0).toLocaleUpperCase() + id.slice(1),
  ...data
});

export function randNamedData(id, dataSize = 5, data = {}) {
  let vars = [];
  let values = [];
  let d = { ...data };
  dataSize = Math.min(dataSize, foobar.length);

  while (vars.length < dataSize) {
    vars.push(randStringNot(vars));
  }

  while (values.length < dataSize) {
    values.push(randData());
  }

  for (let i = 0; i < dataSize; i++) {
    d[vars[i]] = values[i];
  }

  return namedData(id, d);
}

export const stateFromItems = items => ({
  allIds: items.map(item => item.id),
  byId: items.reduce((byId, item) => {
    byId[item.id] = item;
    return byId;
  }, {})
});

export const emptyState = () => ({
  allIds: [],
  byId: {}
});

export function randItems(size = 5, dataSize = 5, items = [], data = {}) {
  items = [...items];
  let ids = [];

  for (let i = 0; i < size; i++) {
    let id = randStringNot(ids);
    ids.push(id);
    items.push(randNamedData(id, dataSize, data));
  }

  return items;
}

export const randState = (...args) => stateFromItems(randItems(...args));

export const testRefEq = (a, b) => expect(a === b).toBe(true);

export const testRefNe = (a, b) => expect(a === b).toBe(false);

export function testStateRefEq(a, b) {
  testRefEq(a, b);
  testRefEq(a.allIds, b.allIds);
  testRefEq(a.byId, b.byId);
}

export function testStateRefNe(a, b) {
  testRefNe(a, b);
  testRefNe(a.allIds, b.allIds);
  testRefNe(a.byId, b.byId);
}

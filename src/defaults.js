export function defaultCreator(data) {
  return { ...data };
}

export function shallowMerge(a, b) {
  return { ...a, ...b };
}

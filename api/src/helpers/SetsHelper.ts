export default class SetsHelper<T> {
  public compareSets = (a: Set<T>, b: Set<T>) => {
    if (a.size !== b.size) {
      return false;
    }
    for (const elem of a) {
      if (!b.has(elem)) {
        return false;
      }
    }
    return true;
  };

  public isSuperset = (set: Set<T>, subset: Set<T>) => {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }
    return true;
  };
}

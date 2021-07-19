export default class ObjectsHelper {
  public static deleteUndefinedFields = (obj: any) => {
    const newObj = {...obj};
    Object.keys(newObj).forEach(key => {
      if (newObj[key] === undefined) {
        delete newObj[key];
      }
    });
    return newObj;
  };

  public static deepEqual(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];
      const areObjects =
        ObjectsHelper.isObject(val1) && ObjectsHelper.isObject(val2);
      if (
        (areObjects && !ObjectsHelper.deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  }

  public static projection(obj: any, fields: string[]) {
    return fields.reduce((record: Record<string, any>, field: string) => {
      if (obj[field] !== undefined) {
        record[field] = obj[field];
      }
      return record;
    }, {});
  }

  private static isObject(obj: any) {
    return obj != null && typeof obj === 'object';
  }
}

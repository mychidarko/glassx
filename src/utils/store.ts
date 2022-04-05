/// author: Charles Stover - ReactN
export const copyObject = <Shape>(obj: Shape): Shape =>
  Object.assign(Object.create(null), obj);

/// author: Charles Stover - ReactN
// Return an object that executes a read listener.
export function objectGetListener<Shape>(
  obj: Shape,
  listener: Function
): Partial<Shape> {
  return (Object.keys(obj as any) as (keyof Shape)[]).reduce(
    (accumulator: Partial<Shape>, key: keyof Shape): Partial<Shape> => {
      Object.defineProperty(accumulator, key, {
        configurable: false,
        enumerable: true,
        get: (): Shape[keyof Shape] => {
          listener(key);
          return obj[key];
        }
      });
      return accumulator;
    },
    Object.create(null)
  );
}

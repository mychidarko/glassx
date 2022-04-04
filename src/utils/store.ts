import { Context } from "lib/context";
import Engine from "lib/engine";

/// author: Charles Stover - ReactN
export const copyObject = <Shape>(obj: Shape): Shape =>
  Object.assign(Object.create(null), obj);

/// author: Charles Stover - ReactN
export function getEngine(): Engine {
  return (
    (Context() &&
      ((Context()._currentValue2) ||
        (Context()._currentValue)))
  );
}

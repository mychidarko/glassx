/// author: Charles Stover - ReactN
export const copyObject = <Shape>(obj: Shape): Shape =>
  Object.assign(Object.create(null), obj);

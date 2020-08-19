function promiseSignal<T>() {
  let resolve: (
    value?: T | PromiseLike<T> | undefined
  ) => void = undefined as any;
  let reject: (reason?: any) => void = undefined as any;
  const promise: Promise<T> = new Promise<T>((fnResolve, fnReject) => {
    resolve = fnResolve;
    reject = fnReject;
  });
  return { promise, resolve, reject };
}

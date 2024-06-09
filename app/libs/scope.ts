import { isNil, isNotNil } from "./nil";

type NonNullableArray<A extends Array<unknown>> = {
  [Key in keyof A]: NonNullable<A[Key]>;
};

class Scope<T> {
  private value?: T;

  constructor(value?: T) {
    this.value = value;
  }

  run<R>(handler: (value: T) => R) {
    if (isNil(this.value)) {
      return;
    }
    const next = handler(this.value);
    return next;
  }

  with<R>(handler: (value: T) => R) {
    if (isNil(this.value)) {
      return;
    }
    const next = handler(this.value);
    return new Scope(next);
  }

  runAll<R>(handler: (value: NonNullableArray<T & Array<unknown>>) => R) {
    if (isNil(this.value) || !(this.value instanceof Array)) {
      return;
    }
    if (this.value.every((item) => isNotNil(item))) {
      return handler(this.value);
    }
  }

  withAll<R>(handler: (value: NonNullableArray<T & Array<unknown>>) => R) {
    if (isNil(this.value) || !(this.value instanceof Array)) {
      return;
    }
    if (this.value.every((item) => isNotNil(item))) {
      const next = handler(this.value);
      return new Scope(next);
    }
  }

  resolve() {
    return this.value;
  }
}

export default Scope;

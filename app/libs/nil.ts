export function isNil<T>(value: T): value is (null | undefined) & T {
  return value === null || value === undefined;
}

export function isNotNil<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isSomeNil<T extends Array<unknown>>(array: T) {
  return array.some((value) => isNil(value));
}

export function isEveryNil<T extends Array<unknown>>(array: T) {
  return array.every((value) => isNil(value));
}

export function isEveryNotNil<T extends Array<unknown>>(array: T) {
  return array.every((value) => isNotNil(value));
}

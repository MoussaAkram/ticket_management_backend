/**
 * Compares two values and determines whether they are different.
 */
export function isDifferent(a: unknown, b: unknown): boolean {
  if (a === b) return false;

  const isObject = (val: unknown) => typeof val === 'object' && val !== null;

  if (isObject(a) && isObject(b)) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  return true;
}

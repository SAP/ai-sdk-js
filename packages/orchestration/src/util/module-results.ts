/**
 * @internal
 */
export function mergeModuleResults<T>(
  ...results: (T | undefined)[]
): T | undefined {
  return results.reduce((acc, result) => {
    if (result === undefined) {
      return acc;
    }
    if (acc === undefined) {
      return result;
    }
    return { ...acc, ...result };
  }, undefined as T | undefined);
}

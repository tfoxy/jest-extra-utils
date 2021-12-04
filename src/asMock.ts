import { JestUtilsError } from "./errors";

/**
 * Useful to keep static checking of parameters and return value with TypeScript.
 * It also throws an error if the given function wasn't mocked.
 * @param fn should be a jest mock.
 * @returns same function but typed as a jest.Mock with correct params and return type.
 */
export function asMock<F extends (...args: never[]) => unknown>(
  fn: F
): jest.Mock<ReturnType<F>, Parameters<F>> {
  if (!jest.isMockFunction(fn)) {
    const fnName = fn.name ? ` "${fn.name}"` : "";
    throw new JestUtilsError(`Function${fnName} is not a mock`);
  }
  return fn;
}

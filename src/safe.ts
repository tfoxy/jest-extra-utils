import { getCodeLine, JestUtilsError } from "./errors";

type Copy<T> = { [K in keyof T]: T[K] };

type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

const SAFE_OBJECT = Symbol("SafeObject");

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function createInnerObject<T>(
  obj: DeepPartial<T>,
  path: string[],
  codeLine: string
): T {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === SAFE_OBJECT) {
        return true;
      }
      if (typeof prop === "symbol" || prop in target) {
        const value: unknown = Reflect.get(target, prop, receiver);
        if (
          isObject(value) &&
          !(prop in Object.getPrototypeOf(target)) &&
          !value[SAFE_OBJECT]
        ) {
          return createInnerObject<unknown>(
            value,
            [...path, String(prop)],
            codeLine
          );
        }
        return value;
      }
      const props = [...path, String(prop)].join(".");
      throw new JestUtilsError(
        `Prop "${props}" was not setted in:\n"${codeLine}"`
      );
    },
  }) as T;
}

/**
 * Creates a partial object that is considered safe to use for tests.
 * If a property is not specified and it's used somewhere in the test,
 * the access throws an error specifing where it's being used and the
 * place where this object was instantiated.
 * @param obj the partial object to be wrapped.
 * @returns a proxy which would behave the same as the object but throws
 * an error if accessing an unknown property.
 */
export function safe<T>(obj: T extends Copy<T> ? DeepPartial<T> : never): T {
  const codeLine = getCodeLine();
  return createInnerObject(obj, [], codeLine);
}

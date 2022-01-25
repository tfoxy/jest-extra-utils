# jest-extra-utils

Jest utilities/patterns that can be useful in a big project

## Installation

```sh
npm install --save-dev jest-extra-utils
```

## Usage

### `asMock`

Useful to keep static checking of parameters and return value with TypeScript.

It also throws an error if the given function wasn't mocked.

```ts
import { asMock } from "jest-extra-utils";
import { useDispatch } from "react-redux";

jest.mock("react-redux");

const useDispatchMock = asMock(useDispatch);
```

### `safe`

Creates a partial object that is considered "safe" to use for tests.

If a property is not specified and it's used somewhere in the test,
the access throws an error specifing where it's being used and the
place where this object was instantiated.

```ts
/* file.ts */
interface MyObject {
  foo1: string;
  foo2: {
    foo3: string | number;
    foo4: number;
  };
}

export function myFunction(obj: MyObject) {
  return obj.foo2.foo3;
}
```

```ts
/* file.test.ts */
import { safe } from "jest-extra-utils";
import myFunction from "./file";

it("should return foo2.foo3 when value is string", () => {
  const value = "bar";
  const result = myFunction(
    safe({
      foo2: { foo3: value },
    })
  );
  expect(result).toBe(value);
});

it("should return foo2.foo3 when value is number", () => {
  const value = 123;
  const result = myFunction(
    safe({
      foo2: { foo4: value },
    })
  );
  expect(result).toBe(value);
});
```

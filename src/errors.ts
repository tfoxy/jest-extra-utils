import parser, { StackFrame } from "error-stack-parser";

function isNotFromThisModule({ fileName }: StackFrame) {
  return !fileName || !fileName.startsWith(`${__dirname}/`);
}

export function getCodeLine(): string {
  const sf = parser.parse(new Error()).filter(isNotFromThisModule)[0];
  return [sf.fileName, sf.lineNumber, sf.columnNumber].join(":");
}

export function removeModuleFromStackTrace(err: Error): Error {
  const stack = parser
    .parse(err)
    .filter(isNotFromThisModule)
    .map(({ source }) => source)
    .join("\n");
  // eslint-disable-next-line no-param-reassign
  err.stack = `${err.toString()}\n${stack}`;
  return err;
}

/**
 * Same as Error, but removes the lines of `jest-extra-utils` from the stack trace.
 *
 * Useful for making jest print the relevant error code block instead of the logic inside `jest-extra-utils`.
 */
export class JestUtilsError extends Error {
  constructor(message?: string) {
    super(message);
    removeModuleFromStackTrace(this);
  }
}

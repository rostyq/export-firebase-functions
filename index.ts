import { join } from "path";
import type { PathLike } from "fs";

export type Exports = typeof module.exports;
export type FunctionMap = Record<string, PathLike>;

function getExports(exports: Exports, path: string[]): Exports {
  let obj = exports;

  while (path.length > 0) {
    const key = path.shift()!;
    if (!obj[key]) obj[key] = {};
    obj = obj[key];
  }

  return obj;
}

export function exportFunction(exports: Exports, name: string, id: PathLike) {
  const path = name.split("-");
  const property = path.pop()!;

  Object.defineProperty(getExports(exports, path), property, {
    enumerable: true,
    get() { return require(id.toString()).default },
  });
}

export function exportFunctions(exports: Exports, root: PathLike, functions: FunctionMap) {
  for (const [name, path] of Object.entries(functions)) {
    exportFunction(exports, name, join(root.toString(), path.toString()));
  }
}

export default exportFunctions;

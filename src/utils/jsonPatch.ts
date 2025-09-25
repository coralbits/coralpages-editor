/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

/**
 * JSON Patch operation types as defined in RFC 6902
 */
export type JSONPatchOp =
  | "add"
  | "remove"
  | "replace"
  | "move"
  | "copy"
  | "test";

/**
 * Base interface for all JSON Patch operations
 */
export interface BaseJSONPatchOperation {
  op: JSONPatchOp;
  path: string;
}

/**
 * Add operation - adds a value at the specified path
 */
export interface AddOperation extends BaseJSONPatchOperation {
  op: "add";
  value: any;
}

/**
 * Remove operation - removes the value at the specified path
 */
export interface RemoveOperation extends BaseJSONPatchOperation {
  op: "remove";
}

/**
 * Replace operation - replaces the value at the specified path
 */
export interface ReplaceOperation extends BaseJSONPatchOperation {
  op: "replace";
  value: any;
}

/**
 * Move operation - moves a value from one path to another
 */
export interface MoveOperation extends BaseJSONPatchOperation {
  op: "move";
  from: string;
}

/**
 * Copy operation - copies a value from one path to another
 */
export interface CopyOperation extends BaseJSONPatchOperation {
  op: "copy";
  from: string;
}

/**
 * Test operation - tests that a value exists at the specified path
 */
export interface TestOperation extends BaseJSONPatchOperation {
  op: "test";
  value: any;
}

/**
 * Union type for all possible JSON Patch operations
 */
export type JSONPatchOperation =
  | AddOperation
  | RemoveOperation
  | ReplaceOperation
  | MoveOperation
  | CopyOperation
  | TestOperation;

/**
 * Array of JSON Patch operations
 */
export type JSONPatch = JSONPatchOperation[];

/**
 * Applies RFC 6902 JSON Patch operations to an object
 * @param target The target object to apply patches to
 * @param patch Array of JSON Patch operations
 * @returns A new object with patches applied, or null if error
 */
export const applyJSONPatch = <T = any>(
  target: T,
  patch: JSONPatch
): T | null => {
  if (!target) {
    console.error("No target object available to apply patch");
    return null;
  }

  try {
    // console.log("Applying JSON Patch:", patch);

    // Create a deep copy of the target to avoid mutating the original
    const patchedObject = JSON.parse(JSON.stringify(target));

    // Apply each patch operation
    for (const operation of patch) {
      // console.log(
      // `Applying operation: ${operation.op} at path: ${operation.path}`
      // );

      switch (operation.op) {
        case "add": {
          const addOp = operation as AddOperation;
          addOperation(patchedObject, addOp.path, addOp.value);
          break;
        }
        case "remove": {
          const removeOp = operation as RemoveOperation;
          removeOperation(patchedObject, removeOp.path);
          break;
        }
        case "replace": {
          const replaceOp = operation as ReplaceOperation;
          replaceOperation(patchedObject, replaceOp.path, replaceOp.value);
          break;
        }
        case "move": {
          const moveOp = operation as MoveOperation;
          moveOperation(patchedObject, moveOp.from, moveOp.path);
          break;
        }
        case "copy": {
          const copyOp = operation as CopyOperation;
          copyOperation(patchedObject, copyOp.from, copyOp.path);
          break;
        }
        case "test": {
          const testOp = operation as TestOperation;
          if (!testOperation(patchedObject, testOp.path, testOp.value)) {
            throw new Error(`Test operation failed at path: ${testOp.path}`);
          }
          break;
        }
        default:
          console.warn(`Unknown operation: ${(operation as any).op}`);
      }
    }

    // console.log("Patch applied successfully. New object:", patchedObject);
    return patchedObject;
  } catch (error) {
    console.error("Error applying JSON Patch:", error);
    return null;
  }
};

// Helper functions for JSON Patch operations
const getValueAtPath = (obj: any, path: string): any => {
  const parts = path.split("/").filter((part) => part !== "");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (isNaN(index)) {
        throw new Error(`Invalid array index: ${part}`);
      }
      current = current[index];
    } else if (typeof current === "object") {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
};

const setValueAtPath = (obj: any, path: string, value: any): void => {
  const parts = path.split("/").filter((part) => part !== "");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (isNaN(index)) {
        throw new Error(`Invalid array index: ${part}`);
      }
      if (!current[index]) {
        current[index] = {};
      }
      current = current[index];
    } else if (typeof current === "object") {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    } else {
      throw new Error(`Cannot set property on non-object at path: ${path}`);
    }
  }

  const lastPart = parts[parts.length - 1];
  if (Array.isArray(current)) {
    const index = parseInt(lastPart, 10);
    if (isNaN(index)) {
      throw new Error(`Invalid array index: ${lastPart}`);
    }
    current[index] = value;
  } else {
    current[lastPart] = value;
  }
};

const addOperation = (obj: any, path: string, value: any): void => {
  if (path === "") {
    // Special case: replace root
    Object.assign(obj, value);
    return;
  }

  const parts = path.split("/").filter((part) => part !== "");
  const lastPart = parts[parts.length - 1];
  const parentPath = parts.slice(0, -1).join("/");

  if (parentPath === "") {
    // Adding to root
    obj[lastPart] = value;
  } else {
    const parent = getValueAtPath(obj, parentPath);
    if (Array.isArray(parent)) {
      const index = parseInt(lastPart, 10);
      if (lastPart === "-") {
        parent.push(value);
      } else if (!isNaN(index)) {
        parent.splice(index, 0, value);
      } else {
        throw new Error(`Invalid array index: ${lastPart}`);
      }
    } else if (typeof parent === "object") {
      parent[lastPart] = value;
    } else {
      throw new Error(`Cannot add to non-object at path: ${parentPath}`);
    }
  }
};

const removeOperation = (obj: any, path: string): void => {
  const parts = path.split("/").filter((part) => part !== "");
  const lastPart = parts[parts.length - 1];
  const parentPath = parts.slice(0, -1).join("/");

  if (parentPath === "") {
    // Removing from root
    delete obj[lastPart];
  } else {
    const parent = getValueAtPath(obj, parentPath);
    if (Array.isArray(parent)) {
      const index = parseInt(lastPart, 10);
      if (!isNaN(index)) {
        parent.splice(index, 1);
      } else {
        throw new Error(`Invalid array index: ${lastPart}`);
      }
    } else if (typeof parent === "object") {
      delete parent[lastPart];
    } else {
      throw new Error(`Cannot remove from non-object at path: ${parentPath}`);
    }
  }
};

const replaceOperation = (obj: any, path: string, value: any): void => {
  setValueAtPath(obj, path, value);
};

const moveOperation = (obj: any, from: string, path: string): void => {
  const value = getValueAtPath(obj, from);
  if (value === undefined) {
    throw new Error(`Source path not found: ${from}`);
  }
  removeOperation(obj, from);
  addOperation(obj, path, value);
};

const copyOperation = (obj: any, from: string, path: string): void => {
  const value = getValueAtPath(obj, from);
  if (value === undefined) {
    throw new Error(`Source path not found: ${from}`);
  }
  addOperation(obj, path, JSON.parse(JSON.stringify(value))); // Deep copy
};

const testOperation = (obj: any, path: string, value: any): boolean => {
  const currentValue = getValueAtPath(obj, path);
  return JSON.stringify(currentValue) === JSON.stringify(value);
};

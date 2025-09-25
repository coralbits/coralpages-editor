/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { Page, Element } from "../types";
import { JSONPatch, applyJSONPatch } from "../utils/jsonPatch";

// Patch operation with metadata for undo/redo system
export interface PatchOperation {
  patch: JSONPatch;
  timestamp: number;
  description?: string; // Optional description for debugging
  can_batch_merge: boolean; // Whether this operation can be batched with others
}

// Patch logger class to manage the patch history
export class PatchLogger {
  private operations: PatchOperation[] = [];
  private currentPosition: number = -1;
  private readonly BATCH_TIMEOUT_MS = 30000; // 30 seconds

  // Add a new patch operation to the log
  addPatch(
    patch: JSONPatch,
    description?: string,
    timestamp?: number,
    can_batch_merge: boolean = true
  ): void {
    // If we're not at the end of the history, truncate future operations
    if (this.currentPosition < this.operations.length - 1) {
      this.operations = this.operations.slice(0, this.currentPosition + 1);
    }

    // Check if we can batch with the previous operation
    const lastOperation = this.operations[this.operations.length - 1];
    const currentTimestamp = timestamp ?? Date.now();
    if (
      can_batch_merge &&
      lastOperation?.can_batch_merge &&
      this.canBatchWithPrevious(patch, lastOperation, currentTimestamp)
    ) {
      // For batching, just use the new patch (last operation)
      this.operations[this.operations.length - 1] = {
        patch: mergePatches(lastOperation.patch, patch), // Use only the new patch, not concatenated
        timestamp: lastOperation.timestamp, // Keep the original timestamp for batching
        description: description || lastOperation.description,
        can_batch_merge: lastOperation.can_batch_merge,
      };
    } else {
      // Add as new operation
      this.operations.push({
        patch,
        timestamp: timestamp ?? Date.now(),
        description,
        can_batch_merge,
      });
      this.currentPosition++;
    }
    console.log("Operations list", this.operations);
  }

  // Check if a patch can be batched with the previous one
  private canBatchWithPrevious(
    newPatch: JSONPatch,
    lastOperation: PatchOperation | undefined,
    newTimestamp: number
  ): boolean {
    if (!lastOperation) return false;

    const timeDiff = newTimestamp - lastOperation.timestamp;

    // Only batch if within time threshold
    if (timeDiff > this.BATCH_TIMEOUT_MS) {
      // console.log("Time diff is greater than batch timeout", timeDiff);
      return false;
    }

    // Only batch small patches (1-5 operations) to allow for character edits
    if (newPatch.length > 10 || lastOperation.patch.length > 10) {
      // console.log(
      //   "Patch length is greater than 5",
      //   newPatch.length,
      //   lastOperation.patch.length
      // );
      return false;
    }

    // Only batch operations on the same element/path
    // This prevents batching unrelated operations
    const newFirstOp = newPatch[0];
    const lastFirstOp = lastOperation.patch[0];

    if (!newFirstOp || !lastFirstOp) {
      // console.log(
      //   "New first op or last first op is undefined",
      //   newFirstOp,
      //   lastFirstOp
      // );
      return false;
    }

    // Don't batch different operation types (replace vs add vs remove, etc.)
    if (newFirstOp.op !== lastFirstOp.op) {
      // console.log(
      //   "New first op or last first op is undefined",
      //   newFirstOp,
      //   lastFirstOp
      // );
      return false;
    }

    // Don't batch add operations with other operations (add element should be separate)
    if (newFirstOp.op === "add" || lastFirstOp.op === "add") {
      // console.log(
      //   "New first op or last first op is add",
      //   newFirstOp,
      //   lastFirstOp
      // );
      return false;
    }

    // Batch if they're operating on the same element or page
    if (newFirstOp.path !== lastFirstOp.path) {
      // console.log(
      //   "New base path is not equal to last base path",
      //   newBasePath,
      //   lastBasePath
      // );
      return false;
    }

    return true;
  }

  // Get all patches up to current position
  getPatchesUpToCurrent(): JSONPatch[] {
    return this.operations
      .slice(0, this.currentPosition + 1)
      .map((op) => op.patch);
  }

  // Undo - move position back
  undo(): boolean {
    if (this.currentPosition >= 0) {
      this.currentPosition--;
      return true;
    }
    return false;
  }

  // Redo - move position forward
  redo(): boolean {
    if (this.currentPosition < this.operations.length - 1) {
      this.currentPosition++;
      return true;
    }
    return false;
  }

  // Check if undo is possible
  canUndo(): boolean {
    return this.currentPosition >= 0;
  }

  // Check if redo is possible
  canRedo(): boolean {
    return this.currentPosition < this.operations.length - 1;
  }

  // Clear all operations (useful when loading a new document)
  clear(): void {
    this.operations = [];
    this.currentPosition = -1;
  }

  // Get current position for debugging
  getCurrentPosition(): number {
    return this.currentPosition;
  }

  // Get total operations count for debugging
  getTotalOperations(): number {
    return this.operations.length;
  }

  // Get the timestamp of the last operation for debugging
  getLastOperationTimestamp(): number | null {
    const lastOp = this.operations[this.operations.length - 1];
    return lastOp ? lastOp.timestamp : null;
  }
}

// Helper function to find element path in the page tree
function findElementPath(
  elements: Element[],
  elementId: string,
  currentPath: string = ""
): string | null {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const elementPath =
      currentPath === "" ? `/children/${i}` : `${currentPath}/children/${i}`;

    if (element.id === elementId) {
      return elementPath;
    }

    if (element.children) {
      const childPath = findElementPath(
        element.children,
        elementId,
        elementPath
      );
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
}

// Apply a single patch to a page
export function applyPatchToPage(page: Page, patch: JSONPatch): Page {
  const result = applyJSONPatch(page, patch);
  if (result === null) {
    console.error("Failed to apply JSON Patch:", patch);
    return page; // Return original page if patch fails
  }
  return result;
}

// Apply multiple patches to a page (for undo/redo)
export function applyPatchesToPage(page: Page, patches: JSONPatch[]): Page {
  let currentPage = page;
  for (const patch of patches) {
    currentPage = applyPatchToPage(currentPage, patch);
  }
  return currentPage;
}

// Convenience functions for common operations
export function createElementPatch(
  page: Page,
  element: Element,
  parentId: string,
  index: number
): JSONPatch {
  if (parentId === "root") {
    return [
      {
        op: "add",
        path: `/children/${index}`,
        value: element,
      },
    ];
  }

  const parentPath = findElementPath(page.children, parentId);
  if (!parentPath) {
    throw new Error(`Parent element with id ${parentId} not found`);
  }

  const targetPath = `${parentPath}/children/${index}`;
  return [
    {
      op: "add",
      path: targetPath,
      value: element,
    },
  ];
}

export function updateElementPatch(
  page: Page,
  elementId: string,
  changes: Partial<Element>
): JSONPatch {
  const elementPath = findElementPath(page.children, elementId);
  if (!elementPath) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  const patches: JSONPatch = [];
  for (const [key, value] of Object.entries(changes)) {
    if (value !== undefined) {
      patches.push({
        op: "replace",
        path: `${elementPath}/${key}`,
        value: value,
      });
    }
  }
  return patches;
}

export function moveElementPatch(
  page: Page,
  elementId: string,
  parentId: string,
  index: number
): JSONPatch {
  const elementPath = findElementPath(page.children, elementId);
  if (!elementPath) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  let newPath: string;
  if (parentId === "root") {
    newPath = `/children/${index}`;
  } else {
    const newParentPath = findElementPath(page.children, parentId);
    if (!newParentPath) {
      throw new Error(`Parent element with id ${parentId} not found`);
    }
    newPath = `${newParentPath}/children/${index}`;
  }

  return [
    {
      op: "move",
      from: elementPath,
      path: newPath,
    },
  ];
}

export function deleteElementPatch(page: Page, elementId: string): JSONPatch {
  const elementPath = findElementPath(page.children, elementId);
  if (!elementPath) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  return [
    {
      op: "remove",
      path: elementPath,
    },
  ];
}

export function updatePagePatch(page: Page, changes: Partial<Page>): JSONPatch {
  const patches: JSONPatch = [];
  for (const [key, value] of Object.entries(changes)) {
    if (value !== undefined) {
      patches.push({
        op: "replace",
        path: `/${key}`,
        value: value,
      });
    }
  }
  return patches;
}

export function updateElementFieldPatch(
  page: Page,
  elementId: string,
  field: string,
  value: any
): JSONPatch {
  const elementPath = findElementPath(page.children, elementId);
  if (!elementPath) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  // Handle nested field paths like "data/fieldName"
  const fieldPath = field.includes("/") ? field : field;
  const fullPath = `${elementPath}/${fieldPath}`;

  return [
    {
      op: "replace",
      path: fullPath,
      value: value,
    },
  ];
}

export function createPatch(
  op: "add" | "replace" | "remove",
  path: string,
  value: any
): JSONPatch {
  return [
    {
      op: op,
      path: path,
      value: value,
    },
  ];
}

function mergePatches(patch1: JSONPatch, patch2: JSONPatch): JSONPatch {
  return patch2;
}

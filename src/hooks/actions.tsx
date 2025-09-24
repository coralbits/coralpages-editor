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
}

// Patch logger class to manage the patch history
export class PatchLogger {
  private operations: PatchOperation[] = [];
  private currentPosition: number = -1;
  private readonly BATCH_TIMEOUT_MS = 30000; // 30 seconds

  // Add a new patch operation to the log
  addPatch(patch: JSONPatch, description?: string, timestamp?: number): void {
    // If we're not at the end of the history, truncate future operations
    if (this.currentPosition < this.operations.length - 1) {
      this.operations = this.operations.slice(0, this.currentPosition + 1);
    }

    // Check if we can batch with the previous operation
    const lastOperation = this.operations[this.operations.length - 1];
    const currentTimestamp = timestamp ?? Date.now();
    if (this.canBatchWithPrevious(patch, lastOperation, currentTimestamp)) {
      // Merge patches by combining them
      const mergedPatch = [...lastOperation.patch, ...patch];
      this.operations[this.operations.length - 1] = {
        patch: mergedPatch,
        timestamp: lastOperation.timestamp, // Keep the original timestamp for batching
        description: description || lastOperation.description,
      };
    } else {
      // Add as new operation
      this.operations.push({
        patch,
        timestamp: timestamp ?? Date.now(),
        description,
      });
      this.currentPosition++;
    }
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
    if (timeDiff > this.BATCH_TIMEOUT_MS) return false;

    // Only batch small patches (1-5 operations) to allow for character edits
    if (newPatch.length > 5 || lastOperation.patch.length > 5) return false;

    // Only batch operations on the same element/path
    // This prevents batching unrelated operations
    const newFirstOp = newPatch[0];
    const lastFirstOp = lastOperation.patch[0];

    if (!newFirstOp || !lastFirstOp) return false;

    // Don't batch different operation types (replace vs add vs remove, etc.)
    if (newFirstOp.op !== lastFirstOp.op) return false;

    // Don't batch add operations with other operations (add element should be separate)
    if (newFirstOp.op === "add" || lastFirstOp.op === "add") return false;

    // Extract the base path (without array indices) for comparison
    const getBasePath = (path: string) => {
      // For element operations, we want to group by the element path
      // For page operations, we want to group by the page root

      // If it's a page-level operation (starts with / but not /children)
      if (path.startsWith("/") && !path.startsWith("/children")) {
        return "/"; // All page-level operations should batch together
      }

      // For element operations, extract the element path up to the element itself
      // /children/0/data -> /children/0
      // /children/0/type -> /children/0
      // /children/0/children/1 -> /children/0
      const elementMatch = path.match(/^(\/children\/\d+)/);
      if (elementMatch) {
        return elementMatch[1]; // Return /children/0, /children/1, etc.
      }

      return path; // Fallback to original path
    };

    const newBasePath = getBasePath(newFirstOp.path);
    const lastBasePath = getBasePath(lastFirstOp.path);

    // Batch if they're operating on the same element or page
    return newBasePath === lastBasePath;
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

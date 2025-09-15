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

// Action types for the undo/redo system
export type Action =
  | {
      type: "CREATE_ELEMENT";
      element: Element;
      parentId: string;
      index: number;
      timestamp: number;
    }
  | {
      type: "UPDATE_ELEMENT";
      elementId: string;
      changes: Partial<Element>;
      timestamp: number;
    }
  | {
      type: "MOVE_ELEMENT";
      elementId: string;
      parentId: string;
      index: number;
      timestamp: number;
    }
  | {
      type: "DELETE_ELEMENT";
      elementId: string;
      element: Element;
      timestamp: number;
    }
  | { type: "UPDATE_PAGE"; changes: Partial<Page>; timestamp: number }
  | {
      type: "BATCH_ELEMENT_UPDATE";
      elementId: string;
      finalElement: Element;
      timestamp: number;
    };

// Action logger class to manage the action history
export class ActionLogger {
  private actions: Action[] = [];
  private currentPosition: number = -1;
  private readonly BATCH_TIMEOUT_MS = 30000; // 30 seconds

  // Add a new action to the log
  addAction(action: Action): void {
    // If we're not at the end of the history, truncate future actions
    if (this.currentPosition < this.actions.length - 1) {
      this.actions = this.actions.slice(0, this.currentPosition + 1);
    }

    // Check if we can batch with the previous action
    const lastAction = this.actions[this.actions.length - 1];
    if (this.canBatchWithPrevious(action, lastAction)) {
      // Replace the last action with the batched version
      this.actions[this.actions.length - 1] = this.mergeActions(
        lastAction,
        action
      );
    } else {
      // Add as new action
      this.actions.push(action);
      this.currentPosition++;
    }
  }

  // Check if an action can be batched with the previous one
  private canBatchWithPrevious(
    newAction: Action,
    lastAction: Action | undefined
  ): boolean {
    if (!lastAction) return false;

    // Only batch UPDATE_ELEMENT actions for the same element
    if (
      newAction.type === "UPDATE_ELEMENT" &&
      lastAction.type === "UPDATE_ELEMENT"
    ) {
      const timeDiff = newAction.timestamp - lastAction.timestamp;
      return (
        newAction.elementId === lastAction.elementId &&
        timeDiff <= this.BATCH_TIMEOUT_MS
      );
    }

    return false;
  }

  // Merge two UPDATE_ELEMENT actions into a single action
  private mergeActions(lastAction: Action, newAction: Action): Action {
    if (
      lastAction.type === "UPDATE_ELEMENT" &&
      newAction.type === "UPDATE_ELEMENT"
    ) {
      return {
        type: "UPDATE_ELEMENT",
        elementId: newAction.elementId,
        changes: {
          ...lastAction.changes,
          ...newAction.changes,
        },
        timestamp: newAction.timestamp, // Use the newer timestamp
      };
    }
    return newAction;
  }

  // Get actions up to current position
  getActionsUpToCurrent(): Action[] {
    return this.actions.slice(0, this.currentPosition + 1);
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
    if (this.currentPosition < this.actions.length - 1) {
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
    return this.currentPosition < this.actions.length - 1;
  }

  // Clear all actions (useful when loading a new document)
  clear(): void {
    this.actions = [];
    this.currentPosition = -1;
  }

  // Get current position for debugging
  getCurrentPosition(): number {
    return this.currentPosition;
  }

  // Get total actions count for debugging
  getTotalActions(): number {
    return this.actions.length;
  }
}

// Apply a single action to a page
export function applyActionToPage(page: Page, action: Action): Page {
  switch (action.type) {
    case "CREATE_ELEMENT":
      return insertElementAtIdx(
        page,
        action.element,
        action.parentId,
        action.index
      );

    case "UPDATE_ELEMENT":
      return updateElementInPage(page, action.elementId, action.changes);

    case "MOVE_ELEMENT":
      return moveElementInPage(
        page,
        action.elementId,
        action.parentId,
        action.index
      );

    case "DELETE_ELEMENT":
      return removeElementFromPage(page, action.elementId);

    case "UPDATE_PAGE":
      return { ...page, ...action.changes };

    case "BATCH_ELEMENT_UPDATE":
      return updateElementInPage(page, action.elementId, action.finalElement);

    default:
      return page;
  }
}

// Apply multiple actions to a page (for undo/redo)
export function applyActionsToPage(page: Page, actions: Action[]): Page {
  let currentPage = page;
  for (const action of actions) {
    currentPage = applyActionToPage(currentPage, action);
  }
  return currentPage;
}

// Helper function to insert element at specific index
function insertElementAtIdx(
  page: Page,
  element: Element,
  parentId: string,
  index: number
): Page {
  const children = insertElementAtIdxRec({
    elements: page.children,
    currentId: "root",
    parentId,
    index,
    element,
  });
  return {
    ...page,
    children: children || [],
  };
}

function insertElementAtIdxRec({
  element,
  elements,
  currentId,
  parentId,
  index,
}: {
  element: Element;
  elements?: Element[];
  currentId: string;
  parentId: string;
  index: number;
}): Element[] | undefined {
  if (!elements) {
    if (currentId === parentId) {
      return [element];
    }
    return undefined;
  }

  if (currentId === parentId) {
    const [pre, post] = [elements.slice(0, index), elements.slice(index)];
    return [...pre, element, ...post];
  }
  const newElements = elements.map((e) => ({
    ...e,
    children: insertElementAtIdxRec({
      element,
      elements: e.children,
      currentId: e.id,
      parentId,
      index,
    }),
  }));
  return newElements;
}

// Helper function to update element in page
function updateElementInPage(
  page: Page,
  elementId: string,
  changes: Partial<Element>
): Page {
  return {
    ...page,
    children: updateElementInChildren(page.children, elementId, changes),
  };
}

function updateElementInChildren(
  elements: Element[],
  elementId: string,
  changes: Partial<Element>
): Element[] {
  return elements.map((element) => {
    if (element.id === elementId) {
      return { ...element, ...changes };
    }
    if (element.children) {
      return {
        ...element,
        children: updateElementInChildren(element.children, elementId, changes),
      };
    }
    return element;
  });
}

// Helper function to move element in page
function moveElementInPage(
  page: Page,
  elementId: string,
  parentId: string,
  index: number
): Page {
  // First remove the element
  const { element, page: pageWithoutElement } = removeElementFromPageHelper(
    page,
    elementId
  );
  if (!element) {
    return page;
  }

  // Then insert it at the new location
  return insertElementAtIdx(pageWithoutElement, element, parentId, index);
}

// Helper function to remove element from page
function removeElementFromPage(page: Page, elementId: string): Page {
  const { page: newPage } = removeElementFromPageHelper(page, elementId);
  return newPage;
}

function removeElementFromPageHelper(
  page: Page,
  elementId: string
): { element: Element | undefined; page: Page } {
  const { element, elements } = removeElementFromChildren(
    page.children,
    elementId
  );
  if (element) {
    return {
      element,
      page: { ...page, children: elements },
    };
  }
  return {
    element: undefined,
    page: page,
  };
}

function removeElementFromChildren(
  elements: Element[],
  elementId: string
): { element: Element | undefined; elements: Element[] } {
  for (const [idx, element] of elements.entries()) {
    if (element.id === elementId) {
      return {
        element,
        elements: elements.filter((e) => e.id !== elementId),
      };
    }

    if (element.children) {
      const { element: childElement, elements: childElements } =
        removeElementFromChildren(element.children, elementId);
      if (childElement) {
        return {
          element: childElement,
          elements: [
            ...elements.slice(0, idx),
            { ...element, children: childElements },
            ...elements.slice(idx + 1),
          ],
        };
      }
    }
  }
  return { element: undefined, elements: elements };
}

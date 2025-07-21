import { useEffect, useState } from "react";
import { Page, Element, Widget } from "../types";
import settings from "../settings";

export interface PageHooks {
  page?: Page;
  findElement: (element_id?: string) => Element | undefined;
  onChangeElement: (element: Element) => void;
  onMoveElement: (element_id: string, parent_id: string, idx: number) => void;
  onAddElement: (
    element_definition: Widget,
    parent_id: string,
    idx: number,
  ) => void;
  onDeleteElement: (element_id: string) => void;
  setPage: (page: Page) => void;

  need_save: boolean;
  savePage: () => Promise<void>;
}

const children_update_element_rec = (
  elements: Element[],
  element: Element,
): Element[] => {
  let found = false;
  const new_elements = elements.map((e) => {
    if (e.id === element.id) {
      found = true;
      console.log("updating", e.id, element.id);
      return element;
    }
    if (found) {
      return e;
    }
    if (e.children) {
      return {
        ...e,
        children: children_update_element_rec(e.children, element),
      };
    }
    return e;
  });
  return new_elements;
};

const find_element_rec = (
  elements: Element[],
  element_id: string,
): Element | undefined => {
  for (const element of elements) {
    if (element.id === element_id) {
      return element;
    }
    if (element.children) {
      const result = find_element_rec(element.children, element_id);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

const usePage = (page_name: string): PageHooks => {
  const [page, setPage] = useState<Page | undefined>(undefined);
  const [need_save, setNeedSave] = useState(false);

  const onChangeElement = (element: Element) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      setNeedSave(true);
      return {
        ...page,
        children: children_update_element_rec(page.children || [], element),
      };
    });
  };

  const onAddElement = (
    element_definition: Widget,
    parent_id: string,
    index: number,
  ) => {
    const element = {
      id: crypto.randomUUID(),
      type: element_definition.name,
      data: {},
    };

    if (!page) {
      return;
    }

    setPage((page) => {
      if (!page) {
        return page;
      }

      const new_page = insert_element_at_idx(page, element, parent_id, index);
      setNeedSave(true);
      return new_page;
    });
  };

  const findElement = (element_id?: string): Element | undefined => {
    if (!page || !element_id) {
      return undefined;
    }
    return find_element_rec(page.children, element_id);
  };

  const onMoveElement = (
    element_id: string,
    parent_id: string,
    idx: number,
  ) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      const new_page = move_element({
        page,
        element_id,
        parent_id,
        idx,
      });
      setNeedSave(true);
      return new_page;
    });
  };

  const onDeleteElement = (element_id: string) => {
    setPage((page) => {
      if (!page) {
        return page;
      }
      const { element, page: new_page } = find_element_and_remove(
        page,
        element_id,
      );
      if (!element) {
        return page;
      }
      setNeedSave(true);
      return new_page;
    });
  };

  useEffect(() => {
    fetch(`${settings.pv_url}/page/${page_name}/json`)
      .then((res) => res.json())
      .then((page) => {
        setPage(page as Page);
        setNeedSave(false);
      });
  }, [page_name]);

  const savePage = async () => {
    if (!page) {
      return;
    }
    await fetch(`${settings.pv_url}/page/${page_name}/json`, {
      method: "POST",
      body: JSON.stringify(page),
    });
    setNeedSave(false);
  };

  return {
    page,
    findElement,
    onChangeElement,
    onAddElement,
    onMoveElement,
    onDeleteElement,
    setPage,

    savePage,
    need_save,
  };
};

export function move_element({
  page,
  element_id,
  parent_id,
  idx,
}: {
  page: Page;
  element_id: string;
  parent_id: string;
  idx: number;
}): Page {
  const { element, page: new_page } = find_element_and_remove(page, element_id);
  if (!element) {
    return page;
  }

  const new_page2 = insert_element_at_idx(new_page, element, parent_id, idx);
  return new_page2;
}

export function find_element_and_remove(
  page: Page,
  element_id: string,
): { element: Element | undefined; page: Page } {
  const { element, elements } = find_element_and_remove_rec(
    page.children,
    element_id,
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

function find_element_and_remove_rec(
  elements: Element[],
  element_id: string,
): { element: Element | undefined; elements: Element[] } {
  for (const [idx, element] of elements.entries()) {
    if (element.id === element_id) {
      return {
        element,
        elements: elements.filter((e) => e.id !== element_id),
      };
    }

    if (element.children) {
      const { element: child_element, elements: child_elements } =
        find_element_and_remove_rec(element.children, element_id);
      if (child_element) {
        return {
          element: child_element,
          elements: [
            ...elements.slice(0, idx),
            { ...element, children: child_elements },
            ...elements.slice(idx + 1),
          ],
        };
      }
    }
  }
  return { element: undefined, elements: elements };
}

export function insert_element_at_idx(
  page: Page,
  element: Element,
  parent_id: string,
  idx: number,
): Page {
  const children = insert_element_at_idx_rec({
    elements: page.children,
    current_id: "root",
    parent_id,
    idx,
    element,
  });
  return {
    ...page,
    children: children || [],
  };
}

function insert_element_at_idx_rec({
  element,
  elements,
  current_id,
  parent_id,
  idx,
}: {
  element: Element;
  elements?: Element[];
  current_id: string;
  parent_id: string;
  idx: number;
}): Element[] | undefined {
  if (!elements) {
    if (current_id === parent_id) {
      return [element];
    }
    return undefined;
  }

  if (current_id === parent_id) {
    const [pre, post] = [elements.slice(0, idx), elements.slice(idx)];
    return [...pre, element, ...post];
  }
  const new_elements = elements.map((e) => ({
    ...e,
    children: insert_element_at_idx_rec({
      element,
      elements: e.children,
      current_id: e.id,
      parent_id,
      idx,
    }),
  }));
  return new_elements;
}

export default usePage;

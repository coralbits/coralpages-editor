import { useEffect, useState } from "react";
import { Page, ElementData, ElementDefinition } from "../types";
import page_json from "../state.json";

export interface PageHooks {
  page?: Page;
  onChangeElement: (element: ElementData) => void;
  onAddElement: (element_definition: ElementDefinition) => void;
  setPage: (page: Page) => void;
}

const usePage = (api_url: string, page_name: string): PageHooks => {
  const [page, setPage] = useState<Page | undefined>(undefined);

  const onChangeElement = (element: ElementData) => {
    if (!page) {
      return;
    }
    const new_page = { ...page };
    new_page.data = new_page.data?.map((e) =>
      e.id === element.id ? element : e
    ) as ElementData[];
    setPage(new_page);
  };

  const onAddElement = (element_definition: ElementDefinition) => {
    const element = {
      id: crypto.randomUUID(),
      type: element_definition.name,
      data: {},
    };

    if (!page) {
      return;
    }
    const new_page = {
      ...page,
      data: [...(page.data || []), element],
    };
    setPage(new_page);
  };

  useEffect(() => {
    fetch(`${api_url}/api/v1/page/${page_name}/json`)
      .then((res) => res.json())
      .then((page) => setPage(page as Page));
  }, [page_name]);

  return {
    page,
    onChangeElement,
    onAddElement,
    setPage,
  };
};

export default usePage;

import { useEffect, useState } from "react";
import { Page, ElementData } from "../types";
import page_json from "../state.json";

export interface PageHooks {
  page?: Page;
  onChangeElement: (element: ElementData) => void;
  setPage: (page: Page) => void;
}

const usePage = (): PageHooks => {
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

  useEffect(() => {
    setPage(page_json as Page);
  }, []);

  return {
    page,
    onChangeElement,
    setPage,
  };
};

export default usePage;

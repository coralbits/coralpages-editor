import { useEffect, useState } from "react";
import { Page, PageData } from "../types";
import page_json from "../state.json";

const usePage = (): [Page | undefined, (page: Page) => void] => {
  const [page, setPage] = useState<Page | undefined>(undefined);

  useEffect(() => {
    setPage(page_json as Page);
  }, []);
  return [page, setPage];
};

export default usePage;

import { useEffect, useState } from "react";
import { i18n } from "../utils/i18n";
import { Container } from "./Container";
import { ResultI, Table } from "./Table";
import history from "../utils/history";
import BottomBar from "./BottomBar";
import settings from "../settings";

interface PageInfo {
  store: string;
  id: string;
  title: string;
  url: string;
}

interface PageResult {
  count: number;
  results: PageInfo[];
}

export const PageList = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="topbar">
        <div className="topbar-title px-4">{i18n("Page List")}</div>
      </div>
      <div className="flex-1">
        <Container className="flex-1 py-10 w-full">
          <Table
            columns={[i18n("Store"), i18n("Id"), i18n("Title")]}
            data_hook={(page: number) => usePages(page)}
            onClick={(row, idx) => {
              history.push(`./${row.id}`);
            }}
          />
        </Container>
      </div>
      <BottomBar />
    </div>
  );
};

const usePages = (page: number) => {
  const [pages, setPages] = useState<PageResult>({ count: 0, results: [] });

  const fecth_pages = async (page: number) => {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const res = await fetch(
      `${settings.pv_url}/page/?offset=${offset}&limit=${page_size}`,
    );
    const data = await res.json();
    setPages(data);
  };

  useEffect(() => {
    fecth_pages(page);
  }, [page]);

  const pagestr = {
    count: pages.count,
    results: pages.results.map((page) => {
      return {
        data: page,
        row: [page.store, page.id, page.title],
      };
    }),
  };

  return pagestr;
};

import { useEffect, useState } from "react";
import { i18n } from "../utils/i18n";
import { Container } from "./Container";
import { Pagination, ResultI, Table } from "./Table";
import history from "../utils/history";
import BottomBar from "./BottomBar";
import settings from "../settings";
import { dialog } from "./dialog";
import { FormField } from "./FormField";

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
    <div className="h-screen w-screen flex flex-col bg-gray-900">
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
            paginator={(props) => (
              <div className="flex justify-between items-center">
                <Pagination {...props} />
                <button
                  className="btn btn-primary h-10 px-4 cursor-pointer"
                  onClick={addPage}
                >
                  {i18n("Create Page")}
                </button>
              </div>
            )}
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
      `${settings.pv_url}/page/?offset=${offset}&limit=${page_size}`
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

const addPage = async () => {
  const { name } = await dialog({
    title: i18n("Create Page"),
    state: {
      name: "",
    },
    content: ({ state, setState, accept, close }) => (
      <div className="flex flex-col gap-2">
        <FormField
          type="text"
          label={i18n("Page Name")}
          name="name"
          value={state.name}
          onChange={(value) => {
            setState({ name: value });
          }}
          onEnter={() => {
            accept();
          }}
          onEscape={() => {
            close();
          }}
        />
      </div>
    ),
    buttons: [
      {
        label: i18n("Create"),
        onClick: (dprops) => {
          dprops.accept();
        },
      },
      {
        label: i18n("Cancel"),
        onClick: (dprops) => {
          dprops.close();
        },
      },
    ],
  });

  console.log({ name });
};

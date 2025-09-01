import { useEffect, useState } from "react";
import settings from "../settings";
import { IdName } from "../types";
import { setPath } from "../hooks/history";
import { i18n } from "../utils/i18n";
import BottomBar from "./BottomBar";
import { Container } from "./Container";
import { dialog } from "./dialog";
import { FormField } from "./FormField";
import { showMessage } from "./messages";
import { Pagination, ResultI, Table } from "./Table";

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
  const [gen, setGen] = useState(0);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <div className="topbar">
        <div className="topbar-title px-4">{i18n("Page List")}</div>
      </div>
      <div className="flex-1">
        <Container className="flex-1 py-10 w-full">
          <Table
            key={gen}
            columns={[i18n("Store"), i18n("Id"), i18n("Title")]}
            data_hook={(page: number) => usePages(page)}
            onClick={(row, idx) => {
              setPath(`${row.store}/${row.id}`);
            }}
            paginator={(props) => (
              <div className="flex justify-between items-center">
                <Pagination {...props} />
                <button
                  className="btn btn-primary h-10 px-4 cursor-pointer"
                  onClick={async () => {
                    const success = await addPage();
                    if (success) {
                      setGen((gen) => gen + 1);
                    }
                  }}
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

  const fetch_pages = async (page: number) => {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const res = await fetch(
      `${settings.pv_url}/page/?offset=${offset}&limit=${page_size}`
    );
    const data = await res.json();
    setPages(data);
  };

  useEffect(() => {
    fetch_pages(page);
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

const addPage = async (): Promise<boolean> => {
  const { store, name } = await dialog({
    title: i18n("Create Page"),
    state: {
      store: "default",
      name: "",
    },
    content: ({ state, setState, accept, close }) => (
      <CreatePageForm
        state={state}
        setState={setState}
        onAccept={accept}
        onClose={close}
      />
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

  const res = await create_page(store, name);

  return res;
};

interface CreatePageFormState {
  store: string;
  name: string;
}

const CreatePageForm = ({
  state,
  setState,
  onAccept,
  onClose,
}: {
  state: CreatePageFormState;
  setState: React.Dispatch<React.SetStateAction<CreatePageFormState>>;
  onAccept: (data?: CreatePageFormState) => void;
  onClose: () => void;
}) => {
  {
    const [stores] = useStoresList();

    return (
      <div className="flex flex-col gap-2">
        <FormField
          type="select"
          label={i18n("Store")}
          name="store"
          value={state.store}
          onChange={(value) => {
            console.log("Set value", value, "prev", state.store);
            setState({ ...state, store: value });
          }}
          options={stores.map((store) => ({
            label: store.name,
            value: store.id,
          }))}
        />
        <FormField
          type="text"
          label={i18n("Page Name")}
          name="name"
          value={state.name}
          onChange={(value) => {
            setState({ ...state, name: value });
          }}
          onEnter={() => {
            onAccept();
          }}
          onEscape={() => {
            onClose();
          }}
        />
      </div>
    );
  }
};

const create_page = async (store: string, path: string): Promise<boolean> => {
  console.log("Creating page", store, path);

  // first check it does not exist yet
  let res_check;
  try {
    res_check = await fetch(`${settings.pv_url}/page/${store}/${path}`);
  } catch (error) {
    showMessage(i18n("Unexpected error"), { level: "error" });
    return false;
  }
  // check estatus code, if 200 already exists, 404 does not exist, so create
  if (res_check.status === 200) {
    showMessage(i18n("Page {name} already exists", { name: path }), {
      level: "warning",
    });
    return false;
  }
  if (res_check.status !== 404) {
    showMessage(i18n("Unexpected error"), { level: "error" });
    return false;
  }

  // create it
  const res_create = await fetch(`${settings.pv_url}/page/${store}/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      title: path,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res_create.ok) {
    showMessage(i18n("Unexpected error"), { level: "error" });
    return false;
  }

  showMessage(i18n("Page {name} created", { name: path }), {
    level: "info",
    duration: 3000,
  });
  return true;
};

const useStoresList = () => {
  const [stores, setStores] = useState<IdName[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(
          `${settings.pv_url}/store?tags=writable,pages`
        );
        const data: ResultI<IdName> = await response.json();
        setStores(data.results);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  return [stores];
};

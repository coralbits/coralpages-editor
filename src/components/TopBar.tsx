import { i18n } from "../utils/i18n";
import { PageHooks } from "../hooks/page";
import { Page } from "../types";
import { selectFile } from "../utils/file";
import Icon from "./Icon";

interface TopBarProps {
  page_hooks: PageHooks;
  preview_url?: string;
}

const TopBar = ({ page_hooks, preview_url }: TopBarProps) => {
  return (
    <nav className="topbar">
      <button
        className="topbar-icon-btn"
        onClick={() => {
          history.back();
        }}
      >
        <Icon name="left" />
      </button>
      <div className="flex items-center gap-2 flex-1 px-4">
        <span className="topbar-title">
          {i18n("Coralbits Universe Page Editor")} - {page_hooks.page?.title}
        </span>
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-icon-btn"
          aria-label={i18n("Download")}
          title={i18n("Download")}
          onClick={() => {
            if (page_hooks.page) {
              download_page(page_hooks.page);
            }
          }}
          disabled={!page_hooks.page}
        >
          <Icon name="download" />
        </button>
        <button
          className="topbar-icon-btn"
          aria-label={i18n("Upload")}
          title={i18n("Upload")}
          onClick={() => upload_page(page_hooks.setPage)}
        >
          <Icon name="upload" />
        </button>

        {preview_url && (
          <a
            className="topbar-icon-btn flex items-center justify-center"
            aria-label={i18n("View page")}
            title={i18n("View page")}
            href={preview_url}
            target={`preview-${page_hooks.page?.id}`}
            rel="noopener noreferrer"
          >
            <Icon name="eye" />
          </a>
        )}
        <button
          className="topbar-icon-btn"
          aria-label={i18n("Save")}
          title={i18n("Save")}
          onClick={page_hooks.savePage}
        >
          <Icon
            name="save"
            className={page_hooks.need_save ? "text-red-500" : ""}
          />
        </button>
      </div>
    </nav>
  );
};

const download_page = (page: Page) => {
  // convert the page to a json string, then to a blob, then to a download link
  const json_str = JSON.stringify(page, null, 2);
  const blob = new Blob([json_str], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${page.title}.json`;
  a.click();
  setTimeout(() => {
    a.remove();
  }, 10000);
  URL.revokeObjectURL(url);
};

const upload_page = async (setPage: (page: Page) => void) => {
  const file = await selectFile("application/json");
  console.log(file);
  if (file) {
    const json_str = await file.text();
    const page = JSON.parse(json_str) as Page;
    setPage(page);
  }
};

export default TopBar;

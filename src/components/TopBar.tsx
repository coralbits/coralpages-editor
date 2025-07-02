import { i18n } from "../utils/i18n";
import page, { PageHooks } from "../hooks/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faDownload,
  faEye,
  faSave,
  faSearch,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Page } from "../types";
import { selectFile } from "../utils/file";

interface TopBarProps {
  page_hooks: PageHooks;
}

const TopBar = ({ page_hooks }: TopBarProps) => {
  return (
    <nav className="topbar">
      <div className="flex items-center gap-2">
        <span className="topbar-title">
          {i18n("Coralbits Universe Page Editor")} - {page_hooks.page?.title}
        </span>
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-icon-btn cursor-pointer"
          aria-label={i18n("Download")}
          title={i18n("Download")}
          onClick={() => {
            if (page_hooks.page) {
              download_page(page_hooks.page);
            }
          }}
          disabled={!page_hooks.page}
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
        <button
          className="topbar-icon-btn cursor-pointer"
          aria-label={i18n("Upload")}
          title={i18n("Upload")}
          onClick={() => upload_page(page_hooks.setPage)}
        >
          <FontAwesomeIcon icon={faUpload} />
        </button>

        <button
          className="topbar-icon-btn cursor-pointer"
          aria-label={i18n("Preview")}
          title={i18n("Preview")}
          onClick={() => {
            window.open(
              page_hooks.page?.url,
              `preview-${page_hooks.page?.id}`,
              "noopener,noreferrer"
            );
          }}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button
          className="topbar-icon-btn cursor-pointer"
          aria-label={i18n("Save")}
          title={i18n("Save")}
          onClick={page_hooks.savePage}
        >
          <FontAwesomeIcon
            icon={faSave}
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

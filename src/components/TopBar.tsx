import { i18n } from "../utils/i18n";
import { PageHooks } from "../hooks/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEye,
  faSave,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
          aria-label="Preview"
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
          aria-label="Save"
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

export default TopBar;

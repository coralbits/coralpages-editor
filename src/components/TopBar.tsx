import { i18n } from "../utils/i18n";
import { PageHooks } from "../hooks/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface TopBarProps {
  page_hooks: PageHooks;
}

const TopBar = ({ page_hooks }: TopBarProps) => {
  return (
    <nav className="topbar">
      {/*<!-- Title / Logo -->*/}
      <div className="flex items-center gap-2">
        <span className="topbar-title">
          {i18n("Coralbits Universe Page Editor")} - {page_hooks.page.title}
        </span>
      </div>

      {/*<!-- Quick access actions (e.g., search, notifications, profile) -->*/}
      <div className="topbar-actions">
        <button className="topbar-icon-btn" aria-label="Search">
          {/*<!-- Example: Search Icon (Heroicons) -->*/}
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button className="topbar-icon-btn" aria-label="Notifications">
          {/*<!-- Example: Bell Icon (Heroicons) -->*/}
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="topbar-icon-btn" aria-label="Profile">
          {/*<!-- Example: User Icon (Heroicons) -->*/}
          <FontAwesomeIcon icon={faUser} />
        </button>
        {/*<!-- Hamburger button for mobile -->*/}
        <button className="topbar-hamburger" aria-label="Open menu">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </nav>
  );
};

export default TopBar;

import { i18n } from "../utils/i18n";
import { Page } from "../types";

interface TopBarProps {
  page: Page;
}

const TopBar = ({ page }: TopBarProps) => {
  return (
    <div className="flex flex-row h-16 bg-purple-500 items-center justify-center">
      <h1 className="text-2xl font-bold text-white">
        {i18n("Coralbits Universe Page Editor")} - {page.title}
      </h1>
    </div>
  );
};

export default TopBar;

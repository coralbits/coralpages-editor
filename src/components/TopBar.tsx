import { i18n } from "../utils/i18n";
import { PageHooks } from "../hooks/page";

interface TopBarProps {
  page_hooks: PageHooks;
}

const TopBar = ({ page_hooks }: TopBarProps) => {
  return (
    <div className="flex flex-row h-16 bg-purple-500 items-center justify-center">
      <h1 className="text-2xl font-bold text-white">
        {i18n("Coralbits Universe Page Editor")} - {page_hooks.page?.title}
      </h1>
    </div>
  );
};

export default TopBar;

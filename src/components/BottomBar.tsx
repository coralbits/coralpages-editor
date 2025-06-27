import { i18n } from "../utils/i18n";

const BottomBar = () => {
  return (
    <div className="flex flex-row h-8 bg-purple-500 items-center justify-center">
      <h1 className="text-sm font-bold text-white">
        <a href="https://www.coralbits.com">{i18n("(C) Coralbits SL 2025")}</a>
      </h1>
    </div>
  );
};

export default BottomBar;

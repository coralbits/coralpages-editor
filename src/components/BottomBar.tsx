import { i18n } from "../utils/i18n";

const BottomBar = () => {
  return (
    <div className="bottombar">
      <h1 className="bottombar-title">
        <a href="https://www.coralbits.com">{i18n("(C) Coralbits SL 2025")}</a>
      </h1>
    </div>
  );
};

export default BottomBar;

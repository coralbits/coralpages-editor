import { i18n } from "../utils/i18n";

const BottomBar = () => {
  return (
    <div className="bottombar">
      <div className="bottombar-title flex flex-row w-full">
        <a href="https://www.coralbits.com">{i18n("(C) Coralbits SL 2025")}</a>
        <div className="flex-1" />
        {i18n("This software is licensed under the AGPLv3 license")}
        {" | "}
        <a
          href="https://www.gnu.org/licenses/agpl-3.0.en.html"
          target="license-agpl3"
          rel="noopener noreferrer"
          className="underline"
        >
          {i18n("Read your rights")}
        </a>
      </div>
    </div>
  );
};

export default BottomBar;

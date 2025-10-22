/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { i18n } from "../utils/i18n";

const BottomBar = () => {
  return (
    <div className="bar h-8 justify-between px-4 border-t border-slate-200 dark:border-slate-700">
      <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex flex-row w-full">
        <a
          href="https://www.coralbits.com"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          (C) Coralbits SL 2025
        </a>
        <div className="flex-1" />
        {i18n("This software is licensed under the AGPLv3 license")}
        {" | "}
        <a
          href="https://www.gnu.org/licenses/agpl-3.0.en.html"
          target="license-agpl3"
          rel="noopener noreferrer"
          className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {i18n("Read your rights")}
        </a>
      </div>
    </div>
  );
};

export default BottomBar;

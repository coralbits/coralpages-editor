/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import ElementEditor from "./ElementEditor";
import ElementSelector from "./ElementSelector";
import DocumentSettings from "./DocumentSettings";
import { PageHooks } from "app/hooks/page";
import { EditorHooks } from "app/hooks/editor";
import ElementStyleEditor from "./ElementStyleEditor";
import Icon from "app/components/Icon";
import { i18n } from "app/utils/i18n";

interface SideBarLeftProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarLeft = (props: SideBarLeftProps) => {
  const selected_element_id = props.editor_hooks.selectedElementId;
  const selected_element = props.page_hooks.findElement(selected_element_id);
  let title = selected_element
    ? selected_element.widget
    : "No element selected";
  if (selected_element_id == "root") {
    title = i18n("Document Settings");
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-w-[350px] max-w-[350px] border-r border-slate-200 dark:border-slate-700">
      <div className="flex flex-row w-full min-h-16">
        <button
          className={`flex-1 cursor-pointer inline-flex flex-col items-center justify-center w-full transition-all duration-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-none rounded-tl-md rounded-bl-md hover:bg-white dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transform hover:-translate-y-0.5 hover:shadow-sm active:transform-none active:shadow-sm ${
            props.editor_hooks.selectedTab === "add"
              ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white shadow-md"
              : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("add")}
        >
          <Icon name="plus" />
        </button>
        <button
          className={`flex-1 cursor-pointer inline-flex flex-col items-center justify-center w-full transition-all duration-200 bg-slate-100 dark:bg-slate-800 border border-y-0 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-none hover:bg-white dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transform hover:-translate-y-0.5 hover:shadow-sm active:transform-none active:shadow-sm ${
            props.editor_hooks.selectedTab === "edit"
              ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white shadow-md"
              : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("edit")}
        >
          {title}
        </button>
        <button
          className={`flex-1 cursor-pointer inline-flex flex-col items-center justify-center w-full transition-all duration-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-none rounded-tr-md rounded-br-md hover:bg-white dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transform hover:-translate-y-0.5 hover:shadow-sm active:transform-none active:shadow-sm ${
            props.editor_hooks.selectedTab === "style"
              ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white shadow-md"
              : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("style")}
        >
          <Icon name="css" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {props.editor_hooks.selectedTab === "edit" &&
          selected_element_id == "root" && (
            <DocumentSettings
              editor_hooks={props.editor_hooks}
              page_hooks={props.page_hooks}
            />
          )}
        {props.editor_hooks.selectedTab === "edit" && selected_element && (
          <ElementEditor
            editor_hooks={props.editor_hooks}
            page_hooks={props.page_hooks}
          />
        )}
        {props.editor_hooks.selectedTab === "add" && (
          <ElementSelector
            page_hooks={props.page_hooks}
            editor_hooks={props.editor_hooks}
          />
        )}
        {props.editor_hooks.selectedTab === "style" && (
          <ElementStyleEditor
            page_hooks={props.page_hooks}
            editor_hooks={props.editor_hooks}
          />
        )}
      </div>
    </div>
  );
};

export default SideBarLeft;

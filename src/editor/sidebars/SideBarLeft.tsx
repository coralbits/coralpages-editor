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
  let title = selected_element ? selected_element.type : "No element selected";
  if (selected_element_id == "root") {
    title = i18n("Document Settings");
  }

  return (
    <div className="flex flex-col h-full sidebar sidebar-left min-w-[350px] max-w-[350px]">
      <div className="flex flex-row w-full sidebar-tabs min-h-16">
        <button
          className={`flex-1 cursor-pointer sidebar-button border-2 items-center justify-center rounded-none rounded-tl-md rounded-bl-md ${
            props.editor_hooks.selectedTab === "add"
              ? "sidebar-button-active"
              : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("add")}
        >
          <Icon name="plus" />
        </button>
        <button
          className={`flex-1 cursor-pointer sidebar-button items-center justify-center rounded-none border border-y-0 border-gray-600 ${
            props.editor_hooks.selectedTab === "edit"
              ? "sidebar-button-active"
              : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("edit")}
        >
          {title}
        </button>
        <button
          className={`flex-1 cursor-pointer sidebar-button border-2 items-center justify-center rounded-none rounded-tr-md rounded-br-md ${
            props.editor_hooks.selectedTab === "style"
              ? "sidebar-button-active"
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

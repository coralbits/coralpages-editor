import { ElementData, ElementDefinition } from "../types";
import ElementEditor from "./ElementEditor";
import ElementSelector from "./ElementSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../hooks/faicon_setup";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";

interface SideBarLeftProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const SideBarLeft = (props: SideBarLeftProps) => {
  return (
    <div className="flex flex-col h-full bg-purple-200 min-w-[320px] max-w-[320px]">
      <div className="flex flex-row bg-purple-200 h-16">
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.editor_hooks.selectedTab === "add" ? "bg-purple-500" : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("add")}
        >
          <FontAwesomeIcon icon={getIcon("plus")} />
        </button>
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.editor_hooks.selectedTab === "edit" ? "bg-purple-500" : ""
          }`}
          onClick={() => props.editor_hooks.setSelectedTab("edit")}
        >
          {props.editor_hooks.selectedElement
            ? props.editor_hooks.selectedElement.type
            : "No element selected"}
        </button>
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.editor_hooks.selectedTab === "edit" ? "bg-purple-500" : ""
          }`}
        >
          <FontAwesomeIcon icon={getIcon("bars")} />
        </button>
      </div>
      {props.editor_hooks.selectedTab === "edit" &&
        props.editor_hooks.selectedElement && (
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
    </div>
  );
};

export default SideBarLeft;

import { Page, ElementData, ElementDefinition } from "../types";
import ElementEditor from "./ElementEditor";
import ElementSelector from "./ElementSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../hooks/faicon_setup";

interface SideBarLeftProps {
  page: Page;
  element?: ElementData;
  elementDefinitions: ElementDefinition[];
  selected_tab?: "add" | "edit";
  setSelectedTab?: (tab: "add" | "edit") => void;
}

const SideBarLeft = (props: SideBarLeftProps) => {
  return (
    <div className="flex flex-col h-full bg-purple-200 min-w-[320px] max-w-[320px]">
      <div className="flex flex-row bg-purple-200 h-16">
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.selected_tab === "add" ? "bg-purple-500" : ""
          }`}
          onClick={() => props.setSelectedTab?.("add")}
        >
          <FontAwesomeIcon icon={getIcon("plus")} />
        </button>
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.selected_tab === "edit" ? "bg-purple-500" : ""
          }`}
          onClick={() => props.setSelectedTab?.("edit")}
        >
          {props.element ? props.element.type : "No element selected"}
        </button>
        <button
          className={`hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2 ${
            props.selected_tab === "edit" ? "bg-purple-500" : ""
          }`}
        >
          <FontAwesomeIcon icon={getIcon("bars")} />
        </button>
      </div>
      {props.selected_tab === "edit" && props.element && (
        <ElementEditor
          element={props.element}
          elementDefinitions={props.elementDefinitions}
        />
      )}
      {props.selected_tab === "add" && (
        <ElementSelector
          elementDefinitions={props.elementDefinitions}
          // onSelect={setSelectedElement}
        />
      )}
    </div>
  );
};

export default SideBarLeft;

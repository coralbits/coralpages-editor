import { Page, PageData, ElementDefinition } from "../types";
import ElementEditor from "./ElementEditor";
import ElementSelector from "./ElementSelector";

interface SideBarLeftProps {
  page: Page;
  element?: PageData;
  elementDefinitions?: ElementDefinition[];
  selected_tab?: "add" | "edit";
  setSelectedTab?: (tab: "add" | "edit") => void;
}

const SideBarLeft = (props: SideBarLeftProps) => {
  return (
    <div className="flex flex-col h-full bg-purple-200 min-w-[400px]">
      <div className="flex flex-row bg-purple-200 h-16">
        <button
          className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2"
          onClick={() => props.setSelectedTab?.("add")}
        >
          +
        </button>
        <button
          className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2"
          onClick={() => props.setSelectedTab?.("edit")}
        >
          {props.element ? props.element.type : "No element selected"}
        </button>
        <button className="hover:bg-purple-500 flex-1 cursor-pointer border-purple-300 border-2">
          -
        </button>
      </div>
      {props.selected_tab === "edit" && props.element && (
        <ElementEditor element={props.element} />
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

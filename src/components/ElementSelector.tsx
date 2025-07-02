import { ElementDefinition } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../hooks/faicon_setup";
import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";

interface ElementSelectorProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const ElementSelector = (props: ElementSelectorProps) => {
  return (
    <div className="flex flex-row gap-4 p-2 flex-wrap w-full mx-2">
      {props.editor_hooks.elementDefinitions?.map((element) => (
        <button
          key={element.name}
          className="flex flex-col gap-2 items-center justify-center h-24 w-24 sidebar-button shadow-md"
          onClick={() => props.page_hooks.onAddElement(element, "root", 10000)}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(
              "application/json",
              JSON.stringify({ action: "create", element_definition: element })
            );
          }}
        >
          <FontAwesomeIcon icon={getIcon(element.icon)} className="text-2xl" />
          <span className="text-sm text-nowrap">
            {getBasicName(element.name)}
          </span>
        </button>
      ))}
    </div>
  );
};

const getBasicName = (name: string) => {
  if (name.includes("://")) {
    return name.split("://")[1];
  }
  return name;
};

export default ElementSelector;

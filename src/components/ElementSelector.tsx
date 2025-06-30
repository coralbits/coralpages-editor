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
    <div className="flex flex-row gap-2 p-2 flex-wrap w-full justify-around">
      {props.editor_hooks.elementDefinitions?.map((element) => (
        <button
          key={element.name}
          className="flex flex-col gap-2 items-center justify-center h-24 w-24 sidebar-button"
          onClick={() => props.page_hooks.onAddElement(element)}
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

import { Widget } from "../types";
import { EditorHooks } from "../hooks/editor";
import { PageHooks } from "../hooks/page";
import Icon from "./Icon";

interface ElementSelectorProps {
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}

const ElementSelector = (props: ElementSelectorProps) => {
  return (
    <div className="flex flex-row gap-4 p-2 flex-wrap w-full margin-auto">
      {props.editor_hooks.elementDefinitions?.map((element) => (
        <ElementSelectorItem
          key={element.name}
          element={element}
          page_hooks={props.page_hooks}
        />
      ))}
    </div>
  );
};

const ElementSelectorItem = (props: {
  element: Widget;
  page_hooks: PageHooks;
}) => {
  return (
    <button
      key={props.element.name}
      className="flex flex-col gap-2 items-center justify-center h-24 w-24 sidebar-button shadow-md"
      onClick={() =>
        props.page_hooks.onAddElement(props.element, "root", 10000)
      }
      title={props.element.description}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            action: "create",
            element_definition: props.element,
          }),
        );
      }}
    >
      <Icon name={props.element.icon} className="text-2xl" />
      <span className="text-sm text-nowrap">
        {getBasicName(props.element.name)}
      </span>
    </button>
  );
};

const getBasicName = (name: string) => {
  if (name.includes("/")) {
    return name.split("/")[1];
  }
  return name;
};

export default ElementSelector;

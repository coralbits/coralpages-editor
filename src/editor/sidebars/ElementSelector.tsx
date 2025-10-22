/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { Widget } from "app/types";
import { EditorHooks } from "app/hooks/editor";
import { PageHooks } from "app/hooks/page";
import Icon from "app/components/Icon";

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
          editor_hooks={props.editor_hooks}
        />
      ))}
    </div>
  );
};

const ElementSelectorItem = (props: {
  element: Widget;
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}) => {
  const handleAddElement = () => {
    // If there's a selected element, add after it; otherwise add at the end
    let newElementId;
    if (props.editor_hooks.selectedElementId) {
      newElementId = props.page_hooks.onCreateElementAfter(
        props.element,
        props.editor_hooks.selectedElementId
      );
    } else {
      newElementId = props.page_hooks.onCreateElement(
        props.element,
        "root",
        10000
      );
    }
    // Select the newly added element
    if (newElementId) {
      props.editor_hooks.setSelectedElementId(newElementId);
      props.editor_hooks.setSelectedTab("edit");
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      key={props.element.name}
      className="flex flex-col gap-2 items-center justify-center w-[calc(33%-1rem)] aspect-square inline-flex flex-col items-center justify-center w-full cursor-pointer transition-all duration-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transform hover:-translate-y-0.5 hover:shadow-sm active:transform-none active:shadow-sm shadow-md m-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title={props.element.description}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            action: "create",
            element_definition: props.element,
          })
        );
      }}
      onClick={handleAddElement}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAddElement();
        }
      }}
    >
      <Icon name={props.element.icon} className="text-2xl" />
      <span className="text-sm text-nowrap">
        {getBasicName(props.element.name)}
      </span>
    </div>
  );
};

const getBasicName = (name: string) => {
  if (name.includes("/")) {
    return name.split("/")[1];
  }
  return name;
};

export default ElementSelector;

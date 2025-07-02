import { useEffect, useState } from "react";
import { EditorField, ElementData, ElementDefinition } from "../types";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";
import { i18n } from "../utils/i18n";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HoldButton from "./HoldButton";

const ElementEditor = ({
  editor_hooks,
  page_hooks,
}: {
  editor_hooks: EditorHooks;
  page_hooks: PageHooks | undefined;
}) => {
  const [element_definition, setElementDefinition] = useState<
    ElementDefinition | undefined
  >(undefined);

  if (!page_hooks) {
    return <div>No page hooks</div>;
  }

  useEffect(() => {
    const definition = editor_hooks.elementDefinitions.find(
      (definition) =>
        definition.name ===
        page_hooks?.findElement(editor_hooks.selectedElementId)?.type
    );
    setElementDefinition(definition);
  }, [editor_hooks.selectedElementId, page_hooks?.page]);

  const editor = element_definition?.editor;

  if (!editor) {
    return <div>No editor found</div>;
  }

  if (typeof editor === "string") {
    return <div>{editor}</div>;
  }
  const selected_element = page_hooks?.findElement(
    editor_hooks.selectedElementId
  );
  if (!selected_element) {
    return <div>No element found</div>;
  }

  const handleChange = (field: EditorField, value: string) => {
    if (!page_hooks) {
      return;
    }
    const new_element = {
      ...selected_element,
      data: {
        ...selected_element?.data,
        [field.name]: value,
      },
    };
    page_hooks.onChangeElement(new_element as ElementData);
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      {editor?.map((field, idx) => (
        <EditorFieldEditor
          field={field}
          key={idx}
          element={selected_element}
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
        />
      ))}
      <div className="flex-1" />
      <DeleteElementButton
        className="m-2"
        page_hooks={page_hooks}
        editor_hooks={editor_hooks}
      />
    </div>
  );
};

const EditorFieldEditor = ({
  field,
  element,
  className,
  onChange,
}: {
  field: EditorField;
  element: ElementData;
  className?: string;
  onChange: (field: EditorField, value: string) => void;
}) => {
  return (
    <div className={className}>
      <label htmlFor={field.name} className="text-sm font-bold">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          className="w-full p-2 border border-gray-800 rounded-md"
          placeholder={field.placeholder}
          name={field.name}
          value={element.data?.[field.name] || ""}
          rows={10}
          onChange={(e) => onChange(field, e.target.value)}
        />
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={element.data?.[field.name] || ""}
          className="w-full p-2 border border-gray-800 rounded-md"
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}
    </div>
  );
};
const DeleteElementButton = ({
  className,
  page_hooks,
  editor_hooks,
}: {
  className?: string;
  page_hooks: PageHooks;
  editor_hooks: EditorHooks;
}) => {
  return (
    <HoldButton
      className={`${className} bg-red-500 hover:bg-red-600`}
      onClick={() => {
        if (!editor_hooks.selectedElementId) {
          return;
        }
        page_hooks.onDeleteElement(editor_hooks.selectedElementId);
      }}
    >
      <FontAwesomeIcon icon={faTrash} className="text-white" />
      {i18n("Delete")}
    </HoldButton>
  );
};

export default ElementEditor;

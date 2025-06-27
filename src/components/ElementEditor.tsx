import { useEffect, useState } from "react";
import { EditorField, ElementData, ElementDefinition } from "../types";
import { PageHooks } from "../hooks/page";
import { EditorHooks } from "../hooks/editor";

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

  useEffect(() => {
    const definition = editor_hooks.elementDefinitions.find(
      (definition) => definition.name === editor_hooks.selectedElement?.type
    );
    setElementDefinition(definition);
  }, [editor_hooks.selectedElement]);

  const editor = element_definition?.editor;

  if (!editor) {
    return <div>No editor found</div>;
  }

  if (typeof editor === "string") {
    return <div>{editor}</div>;
  }

  const handleChange = (field: EditorField, value: string) => {
    if (!page_hooks) {
      return;
    }
    const new_element = { ...editor_hooks.selectedElement };
    new_element.data[field.name] = value;
    page_hooks.onChangeElement(new_element as ElementData);
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      {editor?.map((field, idx) => (
        <EditorFieldEditor
          field={field}
          key={idx}
          element={editor_hooks.selectedElement!}
          className="p-2 border border-gray-300 rounded-md"
          onChange={handleChange}
        />
      ))}
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

export default ElementEditor;

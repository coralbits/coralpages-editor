import { useEffect, useState } from "react";
import { EditorField, ElementData, ElementDefinition } from "../types";

const ElementEditor = ({
  element,
  elementDefinitions,
}: {
  element: ElementData;
  elementDefinitions: ElementDefinition[];
}) => {
  const [element_definition, setElementDefinition] = useState<
    ElementDefinition | undefined
  >(undefined);

  useEffect(() => {
    const definition = elementDefinitions.find(
      (definition) => definition.name === element.type
    );
    setElementDefinition(definition);
  }, [element, elementDefinitions]);

  const editor = element_definition?.editor;

  if (typeof editor === "string") {
    return <div>{editor}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {editor?.map((field, idx) => (
        <EditorFieldEditor
          field={field}
          key={idx}
          element={element}
          className="p-2 border border-gray-300 rounded-md"
        />
      ))}
    </div>
  );
};

const EditorFieldEditor = ({
  field,
  element,
  className,
}: {
  field: EditorField;
  element: ElementData;
  className?: string;
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
          value={element.data?.[field.name]}
          rows={10}
        />
      ) : (
        <input
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={element.data?.[field.name]}
          className="w-full p-2 border border-gray-800 rounded-md"
        />
      )}
    </div>
  );
};

export default ElementEditor;

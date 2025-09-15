/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useEffect, useState } from "react";
import { FieldDefinition, Element, Widget } from "app/types";
import { PageHooks } from "app/hooks/page";
import { EditorHooks } from "app/hooks/editor";
import { i18n } from "app/utils/i18n";
import HoldButton from "app/components/HoldButton";
import { FormField, FormFieldType } from "app/components/FormField";
import Icon from "app/components/Icon";
import { showMessage } from "app/components/messages";

const ElementEditor = ({
  editor_hooks,
  page_hooks,
}: {
  editor_hooks: EditorHooks;
  page_hooks: PageHooks | undefined;
}) => {
  const [element_definition, setElementDefinition] = useState<
    Widget | undefined
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
    return (
      <div className="m-3">
        {i18n("No editor found")}
        <DeleteElementButton
          editor_hooks={editor_hooks}
          page_hooks={page_hooks}
          className="w-full"
        />
      </div>
    );
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

  const handleChange = (field: FieldDefinition, value: string) => {
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
    page_hooks.onChangeElement(new_element as Element);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="p-2 flex justify-end gap-2">
        <div className="flex-1"></div>
        <button
          className="sidebar-button p-2 flex-0  "
          title={i18n("Copy to clipboard (Ctrl+C)")}
          onClick={() => {
            editor_hooks.copyCurrentElement(page_hooks);
          }}
        >
          <Icon name="copy" />
        </button>
        <button
          className="sidebar-button p-2 flex-0"
          title={i18n("Paste from clipboard over current element")}
          onClick={() => editor_hooks.pasteElement(page_hooks)}
        >
          <Icon name="paste" />
        </button>
        <button
          className="sidebar-button p-2 flex-0"
          title={i18n("Paste after current element (Ctrl+V)")}
          onClick={() => editor_hooks.pasteElementAfter(page_hooks)}
        >
          <Icon name="pasteAfter" />
        </button>
      </div>
      {editor?.map((field, idx) => (
        <EditorFieldEditor
          field={field}
          key={idx}
          element={selected_element}
          className="p-2"
          onChange={handleChange}
        />
      ))}
      {editor?.length === 0 && (
        <div className="p-2">
          <p className="text-sm text-gray-500">
            {i18n("No fields to edit for this element.")}
          </p>
        </div>
      )}
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
  field: FieldDefinition;
  element: Element;
  className?: string;
  onChange: (field: FieldDefinition, value: string) => void;
}) => {
  return (
    <FormField
      className={className}
      type={field.type as FormFieldType}
      label={field.label}
      name={field.name}
      value={element.data?.[field.name] || ""}
      options={field.options}
      placeholder={field.placeholder}
      onChange={(value) => onChange(field, value)}
    />
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
      <Icon name="trash" className="text-white" />
      {i18n("Delete")}
    </HoldButton>
  );
};

export default ElementEditor;

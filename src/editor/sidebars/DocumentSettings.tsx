/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { FormField, FormLabel } from "app/components/FormField";
import { EditorHooks } from "app/hooks/editor";
import { PageHooks, useTemplateList } from "app/hooks/page";
import { i18n } from "app/utils/i18n";
import HoldButton from "app/components/HoldButton";
import { showMessage } from "app/components/messages";
import Icon from "app/components/Icon";

const DocumentSettings = ({
  editor_hooks,
  page_hooks,
}: {
  editor_hooks: EditorHooks;
  page_hooks: PageHooks | undefined;
}) => {
  const [templates] = useTemplateList();

  return (
    <div className="p-6 flex flex-col gap-6 h-full">
      <FormField
        type="text"
        label={i18n("Document Title")}
        name="title"
        value={page_hooks?.page?.title || ""}
        onChange={(value) => page_hooks?.onUpdatePage({ title: value })}
      />
      <FormField
        type="select"
        label={i18n("Template")}
        name="template_type"
        value={page_hooks?.page?.template || ""}
        onChange={(value) => page_hooks?.onUpdatePage({ template: value })}
        options={[
          { value: "", label: i18n("empty") },
          ...templates.map((template) => ({
            value: template.id,
            label: template.name,
          })),
        ]}
      />

      <FormLabel label={i18n("Meta Tags")}>
        {page_hooks?.page?.head?.meta?.map((meta, idx) => (
          <div key={idx} className="flex flex-row gap-2 ml-4">
            <FormField
              className="flex-1 w-1/2"
              name={meta.name}
              type="text"
              label={i18n("Name")}
              value={meta.name}
              onChange={(value) => {}}
            />
            <FormField
              className="flex-1 w-1/2"
              name={meta.content}
              type="text"
              label={i18n("Content")}
              value={meta.content}
              onChange={(value) => {}}
            />
            <button
              onClick={() =>
                page_hooks?.onPatchPage("remove", `/head/meta/${idx}`, null)
              }
            >
              {i18n("Delete")}
            </button>
          </div>
        ))}
      </FormLabel>

      <FormLabel label={i18n("Link Tags")}>
        {page_hooks?.page?.head?.link?.map((link, idx) => (
          <div key={idx} className="flex flex-row gap-2 ml-4">
            <FormField
              className="flex-1 w-1/3"
              name={link.rel}
              type="text"
              label={i18n("Rel")}
              value={link.rel}
              onChange={(value) => {}}
            />
            <FormField
              className="flex-1 w-1/3"
              name={link.href}
              type="text"
              label={i18n("Href")}
              value={link.href}
              onChange={(value) => {}}
            />
            <button
              onClick={() =>
                page_hooks?.onPatchPage("remove", `/head/link/${idx}`, null)
              }
              className="border border-primary rounded-md p-2 max-w-10 max-h-10 pointer-cursor ml-2 mt-7 bg-gray-700 hover:bg-focus cursor-pointer"
            >
              <Icon name="trash" />
            </button>
          </div>
        ))}
      </FormLabel>

      <div className="flex-1" />

      <HoldButton
        onClick={async () => {
          if (await page_hooks?.onDeletePage()) {
            window.location.href = "./";
            showMessage(i18n("Document deleted successfully"));
          }
        }}
        className="bg-red-500 hover:bg-red-600"
      >
        {i18n("Delete document")}
      </HoldButton>
    </div>
  );
};

export default DocumentSettings;

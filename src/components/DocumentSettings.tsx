import { FormField } from "./FormField";
import { EditorHooks } from "../hooks/editor";
import { PageHooks, useTemplateList } from "../hooks/page";
import { i18n } from "../utils/i18n";
import { Page } from "../types";

const DocumentSettings = ({
  editor_hooks,
  page_hooks,
}: {
  editor_hooks: EditorHooks;
  page_hooks: PageHooks | undefined;
}) => {
  const [templates] = useTemplateList();

  return (
    <div className="p-6 flex flex-col gap-6">
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
    </div>
  );
};

export default DocumentSettings;

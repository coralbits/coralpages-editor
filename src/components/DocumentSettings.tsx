import { FormField } from "./FormField";
import { EditorHooks } from "../hooks/editor";
import { PageHooks, useTemplateList } from "../hooks/page";
import { i18n } from "../utils/i18n";
import { Page } from "../types";
import HoldButton from "./HoldButton";
import { showMessage } from "./messages";

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

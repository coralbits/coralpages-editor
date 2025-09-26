import { dialog } from "app/components/dialog";
import { i18n } from "app/utils/i18n";
import { FormField } from "app/components/FormField";

export interface LLMPromptProps {
  label: string;
  text: string;
  setText: (text: string) => void;
  accept: () => void;
  close: () => void;
}

export const LLMPrompt = (props: LLMPromptProps) => {
  return (
    <div className="flex flex-col gap-2">
      <FormField
        type="textarea"
        label={i18n(props.label)}
        name="text"
        value={props.text}
        onChange={(text: string) => props.setText(text)}
        placeholder={i18n("Enter the changes you want to make to the page.")}
        onEnter={() => props.accept()}
        onEscape={() => props.close()}
      />

      <button className="btn btn-primary mt-8" onClick={() => props.accept()}>
        {i18n("Send")}
      </button>
    </div>
  );
};

export const llm_prompt_dialog = async (label: string) => {
  const result = await dialog({
    title: i18n("LLM Prompt"),
    state: {
      text: "",
    },
    content: (props) => (
      <LLMPrompt
        label={label}
        text={props.state.text}
        setText={(text: string) => props.setState({ text })}
        accept={() => props.accept()}
        close={() => props.close()}
      />
    ),
  });
  console.log(result);
  return result.text;
};

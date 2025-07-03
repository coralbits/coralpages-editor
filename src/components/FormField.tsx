import { AssetSelectorButton } from "./AssetSelector";

export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "color"
  | "range"
  | "image"
  | "hidden"
  | "boolean";

export interface FormFieldProps {
  className?: string;
  type: FormFieldType;
  label: string;
  name: string;
  value: string;
  options?: { label: string; value: string; icon?: string }[];
  onChange: (value: string) => void;
  label_props?: Partial<FormLabelProps>;
}

interface FormLabelProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  direction?: "column" | "row";
}

export const FormLabel = ({
  label,
  children,
  className,
  direction = "column",
}: FormLabelProps) => {
  return (
    <div
      className={`flex gap-2 ${
        direction === "row" ? "flex-row" : "flex-col"
      } ${className}`}
    >
      <label className="text-sm font-bold">{label}</label>
      {direction === "row" && <div className="flex-1" />}
      {children}
    </div>
  );
};

export const FormFieldDefault = ({
  className,
  type,
  label,
  name,
  value,
  onChange,
  label_props,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <input
        className="border border-gray-300 rounded-md p-2"
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormLabel>
  );
};

export const FormFieldSelect = ({
  type,
  label,
  name,
  value,
  options,
  onChange,
  className,
  label_props,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <select
        className="border border-gray-300 rounded-md p-2"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormLabel>
  );
};

export const FormFieldImage = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
}: FormFieldProps) => {
  return (
    <AssetSelectorButton
      placeholder={label}
      name={name}
      value={value}
      className={`m-2 ${className}`}
      onChange={(value) => onChange(value)}
    />
  );
};

export const FormFieldBoolean = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} direction="row">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={value === "true"}
        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
      />
    </FormLabel>
  );
};

export const FormFieldTextarea = ({
  type,
  label,
  name,
  value,
  onChange,
  className,
  label_props,
}: FormFieldProps) => {
  return (
    <FormLabel label={label} className={className} {...label_props}>
      <textarea
        className="border border-gray-300 rounded-md p-2"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
    </FormLabel>
  );
};

export const FormField = (props: FormFieldProps) => {
  switch (props.type) {
    case "text":
      return <FormFieldDefault {...props} />;
    case "select":
      return <FormFieldSelect {...props} />;
    case "image":
      return <FormFieldImage {...props} />;
    case "textarea":
      return <FormFieldTextarea {...props} />;
    case "color":
      return <FormFieldDefault {...props} label_props={{ direction: "row" }} />;
    case "boolean":
      return <FormFieldBoolean {...props} />;
    default:
      return <FormFieldDefault {...props} />;
  }
};

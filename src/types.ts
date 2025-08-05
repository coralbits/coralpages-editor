export interface Page {
  id?: string;
  url: string;
  title: string;
  template?: string;
  children: Element[];
}

export interface Element {
  id: string;
  type: string;
  data?: any;
  style?: Record<string, string>;
  children?: Element[];
}

export interface Widget {
  name: string;
  description?: string;
  store: string;
  data: Record<string, any>;
  style: Record<string, any>;
  icon: string;
  editor: FieldDefinition[] | string;
}

export interface FieldDefinition {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  options?: { label: string; value: string; icon?: string }[];
}

export interface IdName {
  id: string;
  name: string;
}

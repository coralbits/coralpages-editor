export interface Page {
  id?: string;
  url: string;
  title: string;
  template?: string;
  data: Block[];
}

export interface Block {
  id: string;
  type: string;
  data?: any;
  style?: Record<string, string>;
  children?: Block[];
}

export interface BlockTemplate {
  name: string;
  description?: string;
  store: string;
  data: Record<string, any>;
  style: Record<string, any>;
  icon: string;
  editor: EditorField[] | string;
}

export interface EditorField {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  options?: { label: string; value: string; icon?: string }[];
}

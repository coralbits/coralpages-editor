export interface Page {
  id?: string;
  title: string;
  template?: string;
  data: ElementData[];
}

export interface ElementData {
  id?: string;
  type: string;
  data?: any;
  style?: Record<string, string>;
  children?: ElementData[];
}

export interface ElementDefinition {
  name: string;
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
}

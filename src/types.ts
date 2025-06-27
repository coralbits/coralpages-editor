export interface Page {
  id?: string;
  title: string;
  template?: string;
  data: PageData[];
}

export interface PageData {
  id?: string;
  type: string;
  data?: any;
  children?: PageData[];
}

export interface ElementDefinition {
  name: string;
  store: string;
  data: Record<string, any>;
  style: Record<string, any>;
}

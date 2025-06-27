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

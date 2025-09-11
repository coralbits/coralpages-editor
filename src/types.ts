/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

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
  classes?: string[];
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

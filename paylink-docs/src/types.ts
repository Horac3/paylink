export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string | number | boolean;
  options?: string[];
}

export interface Endpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  auth: boolean;
  pathParams?: Param[];
  queryParams?: Param[];
  bodyParams?: Param[];
  responseExample: unknown;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface ApiResult {
  status: number;
  data: unknown;
  duration: number;
  error?: string;
}

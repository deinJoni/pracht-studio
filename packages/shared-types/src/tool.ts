export type ToolParameter = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required?: boolean;
  default?: any;
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: 'custom' | 'kaibanjs' | 'langchain';
  parameters: ToolParameter[];
  returnType: string;
  version: string;
  isAsync: boolean;
  requiresAuth?: boolean;
  authConfig?: {
    type: 'apiKey' | 'oauth' | 'basic';
    location: 'header' | 'query' | 'body';
    name: string;
  };
}; 
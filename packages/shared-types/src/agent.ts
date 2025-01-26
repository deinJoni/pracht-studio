export type LLMConfig = {
  provider: 'openai' | 'google' | 'anthropic' | 'mistral';
  model: string;
  maxRetries?: number;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  goal: string;
  background?: string;
  skills: string[];
  tools?: string[]; // References to tool IDs
  llmConfig?: LLMConfig;
  maxIterations?: number;
  forceFinalAnswer?: boolean;
};
  
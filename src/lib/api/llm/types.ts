export type LLMRole = "system" | "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export interface LLMGenerationOptions {
  temperature: number;
  max_tokens: number;
  stream: boolean;
  stop: string[];
  /**
   * Yes, repitition. Janitor AI team do not spell it correctly
   */
  repitition_penalty: number;
  messages: Array<LLMMessage>;
}

export interface EventDataGeneration {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    { index: number; delta: { content: string }; finish_reason: string }
  ];
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens: number;
  };
}

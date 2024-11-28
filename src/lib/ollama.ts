import { Ollama } from "ollama";

interface OllamaWithModelOptions {
  model: string;
}

export class OllamaWithModel extends Ollama {
  model: string;

  constructor({ model }: OllamaWithModelOptions) {
    super();
    this.model = model;
  }
}

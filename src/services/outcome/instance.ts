import { OllamaWithModel } from "~/lib/ollama";

export const outcome = new OllamaWithModel({
  model: "smollm2:1.7b-instruct-q4_K_S",
});

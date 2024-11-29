import { OllamaWithModel } from "~/lib/ollama";

export const outcome = new OllamaWithModel({
  model: "gemma2:2b-instruct-q6_K",
});

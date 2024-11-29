import { OllamaWithModel } from "~/lib/ollama";

export const outcome = new OllamaWithModel({
  model: "phi3.5:3.8b-mini-instruct-q4_K_M",
});

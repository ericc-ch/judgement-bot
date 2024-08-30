import { encodingForModel } from "js-tiktoken";
import { Character } from "./api/kim";
import { LLMMessage } from "./api/llm/types";

export const promptBase = (character: Character) =>
  `{{char}}'s name: ${character.name}. 
{{char}} calls {{user}} by {{user}} or any name introduced by {{user}}. 
Avoid repetition in replies to {{user}}. 

[Write at least 1 medium paragraphs replies with each paragraph containing at least 2 sentences. 
Do not act and talk as {{user}}. 
Be creative and always drive the roleplay forward.].

Always respond with less than 1500 characters. The messages are optimized for Discord Application so each messages cannot exceed 1500 characters.`;

export const promptPersonality = (character: Character) =>
  `{{char}}'s Persona: ${character.personality}`;

export const promptScenario = (character: Character) =>
  `Scenario: ${character.scenario}`;

export const promptExampleDialogs = (character: Character) =>
  `Example conversations between {{char}} and {{user}}: ${character.description}`;

export const promptSummary = (summary: string) =>
  `Summary of whats happening: ${summary}`;

export const systemPromptBuilder = (character: Character, summary?: string) =>
  `
${promptBase(character)}
${promptPersonality(character)}
${promptScenario(character)}
${promptExampleDialogs(character)}
${summary ? promptSummary(summary) : ""}`;

export const assistantFirstPrompt = (character: Character) =>
  `{{char}}'s first message: ${character.first_message}`;

export const formatCharacterName = (prompt: string, character: Character) =>
  prompt.replaceAll(/{{char}}/gi, character.name);

export const formatUserName = (prompt: string, username: string) =>
  prompt.replaceAll(/{{user}}/gi, username);

interface FormatPromptOptions {
  character: Character;
  username: string;
  prompt: string;
}

export const formatPrompt = (options: FormatPromptOptions) =>
  formatCharacterName(
    formatUserName(options.prompt, options.username),
    options.character
  );

export const sanitizeMentions = (prompt: string) =>
  prompt.replaceAll(/<@\d+>/g, "");

export const JANITOR_AI_MAX_TOKENS = 3200;

export const getTokensLength = (prompt: string) => {
  const encoder = encodingForModel("gpt-3.5-turbo");

  const tokens = encoder.encode(prompt);
  return tokens.length;
};

export const isBelowMaxTokens = (prompt: string) =>
  getTokensLength(prompt) < JANITOR_AI_MAX_TOKENS;

export const compressPrompts = (prompts: Array<LLMMessage>) => {
  const compressedPrompts: Array<LLMMessage> = [];
  compressedPrompts.push(prompts[0]);

  const promptsWithoutFirst = prompts.slice(1).toReversed();

  let isPastMaxTokens = false;
  let i = 0;
  while (!isPastMaxTokens) {
    const lastMessage = promptsWithoutFirst[i++];

    // No more messages to process, entire conversation fits within max tokens
    if (!lastMessage) return compressedPrompts;

    compressedPrompts.splice(1, 0, lastMessage);

    const promptString = compressedPrompts
      .map((prompt) => prompt.content)
      .join(" ");

    if (!isBelowMaxTokens(promptString)) {
      isPastMaxTokens = true;
      return compressedPrompts.toSpliced(1, 1);
    }
  }

  return compressedPrompts;
};

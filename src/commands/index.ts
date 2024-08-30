import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
} from "discord.js";
import fs from "node:fs/promises";
import path from "node:path";

export type ImportedSlashCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => any;
};

export const commands = new Collection<string, ImportedSlashCommand>();

const FOLDER_SLASH = path.join(__dirname, "slash");

const slashCommandFiles = await fs.readdir(FOLDER_SLASH);

for (const file of slashCommandFiles) {
  const filePath = path.join(FOLDER_SLASH, file);
  const command = (await import(filePath)) as ImportedSlashCommand;
  commands.set(command.data.name, command);
}

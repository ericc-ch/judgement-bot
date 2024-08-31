import { SlashCommandBuilder } from "discord.js";
import { debounce } from "lodash";
import { ImportedSlashCommand } from "..";
import { llm } from "~/lib/api";

export const data = new SlashCommandBuilder()
  .setName("summary")
  .setDescription("Save the current conversation as a summary");

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  await interaction.reply(`[FEATURE NOT FINISHED]`);
};

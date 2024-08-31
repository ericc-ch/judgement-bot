import { SlashCommandBuilder } from "discord.js";
import { llm } from "~/lib/api";
import { LLMMessage } from "~/lib/api/llm/types";
import { CHARACTERS } from "~/lib/character";
import { ACTIVE_DATABASES } from "~/lib/db";
import { compressPrompts } from "~/lib/prompt";
import { ImportedSlashCommand } from "..";

export const data = new SlashCommandBuilder()
  .setName("createroom")
  .setDescription("Create a new game room");

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a server");

  

  const message = interaction.options.getString("message") ?? "";

  const character = CHARACTERS.get(interaction.guildId);
  const db = ACTIVE_DATABASES.get(interaction.guildId);

  const initialMessage = `${character.name} said: ${message}`;

  interaction.reply(`${interaction.user.displayName} said: ${message}`);
  const botMessage = await interaction.followUp(initialMessage);
  interaction.followUp(`Error: ${JSON.stringify(e)}`);
};

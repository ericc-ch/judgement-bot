import { SlashCommandBuilder } from "discord.js";
import { fetchCharacter } from "~/lib/character";
import { initCharDb } from "~/lib/db";
import { ImportedSlashCommand } from "..";
import { Character } from "~/lib/api/kim";

export const data = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Set the bot as a character")
  .addStringOption((option) =>
    option
      .setName("url")
      .setDescription("Janitor AI Character URL")
      .setRequired(true)
  );

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a server");

  const url = interaction.options.getString("url") ?? "";

  let character: Character;

  try {
    character = await fetchCharacter(interaction.guildId, url);
  } catch (error) {
    return interaction.reply((error as Error).message);
  }

  await initCharDb(interaction.guildId, character);

  await interaction.reply(`Character set to: ${character.name}`);
};

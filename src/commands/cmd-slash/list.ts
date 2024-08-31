import { SlashCommandBuilder } from "discord.js";
import fsPromises from "node:fs/promises";
import { getGuildDatabases } from "~/lib/db";
import { ImportedSlashCommand } from "..";

export const data = new SlashCommandBuilder()
  .setName("list")
  .setDescription(
    "List all of the initialized characters for this server (you can always add more)"
  );

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a server");

  const PATH_GUILD_DATABASES = getGuildDatabases(interaction.guildId);
  const files = await fsPromises.readdir(PATH_GUILD_DATABASES);

  await interaction.reply(files.join("\n"));
};

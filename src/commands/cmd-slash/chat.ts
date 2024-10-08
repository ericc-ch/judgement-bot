import { SlashCommandBuilder } from "discord.js";
import { llm } from "~/lib/api";
import { LLMMessage } from "~/lib/api/llm/types";
import { CHARACTERS } from "~/lib/character";
import { ACTIVE_DATABASES } from "~/lib/db";
import { compressPrompts } from "~/lib/prompt";
import { ImportedSlashCommand } from "..";

export const data = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Set the bot as a character")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("What do you want to say?")
      .setRequired(true)
  );

export const execute: ImportedSlashCommand["execute"] = async (interaction) => {
  if (!interaction.inGuild())
    return interaction.reply("This command can only be used in a server");

  interaction.reply(`${interaction.user.displayName} said: ${message}`);
  const botMessage = await interaction.followUp(initialMessage);

  interaction.followUp(`Error: ${JSON.stringify(e)}`);

  const newMessages: Array<LLMMessage> = [
    ...db.data.messages,
    { role: "user", content: message },
  ];
};

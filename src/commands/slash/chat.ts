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

  const message = interaction.options.getString("message") ?? "";

  const character = CHARACTERS.get(interaction.guildId);
  const db = ACTIVE_DATABASES.get(interaction.guildId);

  if (!character) {
    await interaction.reply(
      "Character isn't set. Please set it with /set command"
    );
    return;
  }
  if (!db) {
    await interaction.reply("Character database (somehow) not found");
    return;
  }

  const initialMessage = `${character.name} said: ${message}`;

  interaction.reply(`${interaction.user.displayName} said: ${message}`);
  const botMessage = await interaction.followUp(initialMessage);

  const newMessages: Array<LLMMessage> = [
    ...db.data.messages,
    { role: "user", content: message },
  ];

  try {
    const response = await llm.generate({
      messages: compressPrompts(newMessages),
      onMessage: async (response) => {
        await botMessage.edit(response);
      },
    });
    newMessages.push({ role: "assistant", content: response });
    db.update((data) => (data.messages = newMessages));
  } catch (e) {
    interaction.followUp(`Error: ${JSON.stringify(e)}`);
    console.error(e);
  }
};

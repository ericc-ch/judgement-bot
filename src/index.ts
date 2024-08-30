import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import { llm } from "./lib/api";
import { LLMMessage } from "./lib/api/llm/types";
import { CHARACTERS } from "./lib/character";
import { ACTIVE_DATABASES, initDbDir } from "./lib/db";
import { compressPrompts, formatPrompt, sanitizeMentions } from "./lib/prompt";
import { secondsToMs } from "./lib/time";
import { fetchToken } from "./lib/token";
import { validateMessage } from "./lib/validate";

const characterUrl =
  "https://janitorai.com/characters/ddd1498a-a370-4136-b138-a8cd9461fdfe_character-aqua-the-useless-goddess";

await initDbDir();
await fetchToken();

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.login(import.meta.env.VITE_BOT_TOKEN);

client.once(Events.ClientReady, (client) => {
  console.log(`${client.user.displayName} is now online!`);
});

// Register Slash Commands
client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  command.execute(interaction);
});

client.on(Events.MessageCreate, async (message) => {
  if (!validateMessage(message)) return;

  const character = CHARACTERS.get(message.guildId);
  const db = ACTIVE_DATABASES.get(message.guildId);

  if (!character) {
    await message.reply("Character isn't set. Please set it with /set command");
    return;
  }
  if (!db) {
    await message.reply("Character database (somehow) not found");
    return;
  }

  await message.channel.sendTyping();

  const typingInterval = setInterval(async () => {
    await message.channel.sendTyping();
  }, secondsToMs(9));

  let response = "";

  const newMessages: Array<LLMMessage> = [
    ...db.data.messages,
    { role: "user", content: sanitizeMentions(message.content) },
  ];

  try {
    response = await llm.generate({ messages: compressPrompts(newMessages) });
    newMessages.push({ role: "assistant", content: response });
    db.update((data) => (data.messages = newMessages));
  } catch (e) {
    response = `Error: ${(e as Error).message}`;
    console.error(e);
  }

  await message.reply(
    formatPrompt({
      character,
      prompt: response,
      username: message.author.displayName,
    })
  );
  clearInterval(typingInterval);
});

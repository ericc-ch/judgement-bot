import {
  Client,
  Events,
  GatewayIntentBits,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { throttle } from "lodash-es";

import { DISCORD_TOKEN } from "./lib/env";
import { generateOutcome } from "./services/outcome/outcome";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

await client.login(DISCORD_TOKEN);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} is ready!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channel.isThread()) return;

  const parsedCommand = message.content.split(" ");

  if (parsedCommand[0] === "!start") {
    const scenario = parsedCommand.slice(1).join(" ");

    const thread = await message.startThread({
      name: `Scenario: ${scenario}`,
      rateLimitPerUser: 15,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
    });

    let timeLimit = 30;
    const timerMessage = await thread.send(`${timeLimit} seconds left`);

    const timer = setInterval(async () => {
      timeLimit = timeLimit - 1;
      await timerMessage.edit(`${timeLimit} seconds left`);
      if (timeLimit <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    const collector = thread.createMessageCollector({ time: 30_000 }); // Collect messages for 30 seconds

    collector.on("end", async (collected) => {
      const input = collected
        .filter((message) => !message.author.bot)
        .map((message) => ({
          player: message.author.username,
          action: message.content,
        }))
        .reduce<Array<{ player: string; action: string }>>((prev, curr) => {
          const playerIndex = prev.findIndex((p) => p.player === curr.player);

          if (playerIndex !== -1) {
            prev[playerIndex].action += curr.action;
          } else {
            prev.push(curr);
          }

          return prev;
        }, []);

      const response = await generateOutcome({
        scenario,
        input,
      });

      let fullMessage = "The outcome of the game is:\n\n";

      const responseMessage = await thread.send(fullMessage);

      const editMessage = throttle(
        (message: string) => responseMessage.edit(message),
        1000,
      );

      for await (const chunk of response) {
        fullMessage += chunk.message.content;
        await editMessage(fullMessage);
      }
    });
  }
});

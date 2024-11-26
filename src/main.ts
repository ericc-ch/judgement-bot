import { Client, Events, GatewayIntentBits } from 'discord.js'

import { DISCORD_TOKEN } from './lib/env'

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Handle messages
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return

  // Basic command handling
  if (message.content.startsWith('!hello')) {
    await message.reply('Hello! I am your Discord bot!')
  }
})

// Log in to Discord with your client's token
await client.login(DISCORD_TOKEN)

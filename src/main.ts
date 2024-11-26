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

  // Create a thread command
  if (message.content.startsWith('!start')) {
    try {
      const threadName = message.content.split(' ').slice(1).join(' ') || 'New Discussion'
      const thread = await message.startThread({
        autoArchiveDuration: 60,
        name: threadName,
        reason: 'Created a new thread via command',
      })
      await thread.send('Thread created! Let\'s start the discussion.')
    }
    catch (error) {
      console.error('Error creating thread:', error)
      await message.reply('Sorry, I couldn\'t create the thread. Make sure I have the necessary permissions!')
    }
  }
})

// Log in to Discord with your client's token
await client.login(DISCORD_TOKEN)

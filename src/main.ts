import { Client, Events, GatewayIntentBits } from 'discord.js'

import { DISCORD_TOKEN } from './lib/env'

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
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

  const parsedCommand = message.content.split(' ')

  if (parsedCommand[0] === '!start') {
    // Create a thread from the message
    const thread = await message.startThread({
      autoArchiveDuration: 60, // Thread will archive after 60 minutes of inactivity
      name: `Session-${message.author.username}`,
    })

    // Send initial message in the thread
    await thread.send(
      'Thread created! Here are some examples of thread operations:',
    )

    // Example 1: Send a message to the thread
    await thread.send('Example 1: Sending a message to the thread')

    // Example 2: Add a message collector to the thread
    const collector = thread.createMessageCollector({ time: 30000 }) // Collect messages for 30 seconds

    collector.on('collect', async (msg) => {
      if (msg.author.bot) return
      await thread.send(`Collected a message: ${msg.content}`)
    })

    collector.on('end', async (collected) => {
      await thread.send(
        `Message collection ended. Collected ${collected.size} messages. ${JSON.stringify(collected.toJSON()).slice(0, 100)}`,
      )
    })

    // Example 4: Get thread members
    const members = await thread.members.fetch()
    await thread.send(`Current thread members: ${members.size}`)

    // Example 5: Edit thread properties
    await thread.edit({
      name: `Active-Session-${message.author.username}`,
      rateLimitPerUser: 5, // Add 5 second slowmode
    })
  }
})

// Log in to Discord with your client's token
await client.login(DISCORD_TOKEN)

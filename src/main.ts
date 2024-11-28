import { Client, Events, GatewayIntentBits } from 'discord.js'

import { DISCORD_TOKEN } from './lib/env'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

await client.login(DISCORD_TOKEN)

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} is ready!`)
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return
  if (message.channel.isThread()) return

  const parsedCommand = message.content.split(' ')

  if (parsedCommand[0] === '!start') {
    const scenario = parsedCommand.slice(1).join(' ')

    const thread = await message.startThread({
      name: `Scenario: ${scenario}`,
      rateLimitPerUser: 15,
    })

    let timeLimit = 60
    const timerMessage = await thread.send(`${timeLimit} seconds left`)

    const timer = setInterval(async () => {
      timeLimit = timeLimit - 1
      await timerMessage.edit(`${timeLimit} seconds left`)
      if (timeLimit <= 0) {
        clearInterval(timer)
        await thread.send('Time is up!')
      }
    }, 1000)

    const collector = thread.createMessageCollector({ time: 60_000 }) // Collect messages for 30 seconds

    collector.on('end', async (collected) => {
      const messages = collected.map(message => ({
        author: message.author.username,
        content: message.content,
      }))

      await thread.send(
        `Message collection ended. ${JSON.stringify(messages)}`,
      )
    })
  }
})

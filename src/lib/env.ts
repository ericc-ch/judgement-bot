import { env } from 'std-env'

export const DISCORD_TOKEN = env.DISCORD_TOKEN

if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is not set')
}

import { ChannelType, Message } from "discord.js";

type MessageValidator = (message: Message<boolean>) => boolean;

export const ALLOWED_CHANNELS = [
  "1208487548612251660",
  "1206881640991825920",
  "1210092694853132308",
  "1195286524380598287",
];

export const validateMessage = (
  message: Message<boolean>
): message is Message<true> => {
  return (
    isNotFromBot(message) &&
    isBotMentioned(message) &&
    isInAllowedChannel(message) &&
    isInGuild(message) &&
    isGuildTextChannel(message)
  );
};

const isNotFromBot: MessageValidator = (message) => {
  return !message.author.bot;
};

const isBotMentioned: MessageValidator = (message) => {
  return message.mentions.users.has(message.client.user.id);
};

const isInAllowedChannel: MessageValidator = (message) => {
  return ALLOWED_CHANNELS.includes(message.channelId);
};

const isGuildTextChannel: MessageValidator = (message) => {
  return message.channel.type === ChannelType.GuildText;
};

const isInGuild: MessageValidator = (message) => {
  return message.inGuild();
};

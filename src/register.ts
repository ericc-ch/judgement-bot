import { REST, Routes } from "discord.js";
import { commands } from "./commands";

const body = commands.map((value) => value.data.toJSON());

const rest = new REST().setToken(import.meta.env.VITE_BOT_TOKEN);

console.log("Registering commands...");
try {
  await rest.put(Routes.applicationCommands(import.meta.env.VITE_APP_ID), {
    body,
  });

  console.log("Commands registered!");
} catch (e) {
  console.log(e);
}

process.exit();

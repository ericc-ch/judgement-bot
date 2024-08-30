import { minutesToMs } from "~/lib/time";
import { auth } from "./api";

export let TOKEN = "";

export const fetchToken = async () => {
  await updateToken();

  setInterval(async () => {
    await updateToken();
  }, minutesToMs(1));
};

const updateToken = async () => {
  if (TOKEN) console.log(`Previous token found, refreshing token...`);
  else console.log(`Logging in as ${import.meta.env.VITE_JANITOR_EMAIL}...`);

  try {
    const response = await auth.signIn({
      body: {
        email: import.meta.env.VITE_JANITOR_EMAIL,
        password: import.meta.env.VITE_JANITOR_PASSWORD,
      },
    });

    TOKEN = response.access_token;
    console.log(`Login success! Token updated.`);
  } catch (e) {
    console.log(`Failed to login, ${e}`);
  }
};

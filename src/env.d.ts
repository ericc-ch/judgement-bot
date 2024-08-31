declare module "bun" {
  interface Env {
    CLIENT_ID: string;
    CLIENT_SECRET: string;

    GEMINI_API_KEY: string;
  }
}

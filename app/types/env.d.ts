export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | undefined;
      NODE_ENV: "development" | "production" | "test";
      OPENAI_API_KEY: string;
      OPENAI_ORG_ID: string;
      GEMINI_FLASH_KEY: string;
    }
  }
}

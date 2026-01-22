declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT: string
      DISCORD_GUILD: string
      DISCORD_CHANNEL: string
      DISCORD_TOKEN: string
    }
  }
}

export {};
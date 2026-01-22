import type { Client, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export abstract class Command {
  abstract data: { name: string; description: string; options?: any[] };
  abstract execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void>;
}
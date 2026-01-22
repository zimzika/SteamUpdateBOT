import type { Command } from "../types/Command.type.js";
import { type Client, type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { DatabaseHelper } from "../helpers/Database.helper.js";

export default class RemoveGameCommand implements Command {
  data = {
    name: "removegame",
    description: "Remove game of monitoring",
    options: [
      {
        name: "appid",
        description: "Steam Application ID",
        type: 4,
        required: true
      }
    ]
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    const appid = interaction.options.getInteger("appid");

    const database = DatabaseHelper.instance.db;

    try {
      await database.getData(`/${appid}`);
      await database.delete(`/${appid}`);

      interaction.reply({
        content: `Game with ID ${appid} removed from monitoring`,
        flags: MessageFlags.Ephemeral
      })
    } catch (_) {
      interaction.reply({
        content: `Game with ID ${appid} not found`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
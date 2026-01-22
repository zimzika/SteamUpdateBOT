import type { Command } from "../types/Command.type.js";
import { type Client, type ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from "discord.js";
import { DatabaseHelper } from "../helpers/Database.helper.js";

export default class ListGamesCommand implements Command {
  data = {
    name: "listgames",
    description: "List of games monitoring"
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    const database = DatabaseHelper.instance.db;

    try {
      const data = await database.getData("/");
      const games: { name: string, appid: string, buildid: string, timeUpdated: string, dateUpdated: string }[] = Object.values(data);

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Random")
            .setTitle("Monitoring games")
            .setDescription(games.map(game => `**${game.name}** | ${game.appid} - \`${game.timeUpdated} - ${game.dateUpdated}\``).join("\n")),
        ],
        flags: MessageFlags.Ephemeral
      });
    } catch (_) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("Error")
            .setDescription("Not found games")
        ],
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
import type { Command } from "../types/Command.type.js";
import { type Client, type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { SteamAppInfo } from "../helpers/Steam.helper.js";
import { DatabaseHelper } from "../helpers/Database.helper.js";

export default class AddGameCommand implements Command {
  data = {
    name: "addgame",
    description: "Add game to monitoring",
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

    const steam = new SteamAppInfo();

    await steam.connect();

    const gameInfo = await steam.getPublicBranchUpdate(appid!);

    steam.disconnect();

    const database = DatabaseHelper.instance.db;

    try {
      await database.getData(`/${appid}`);
      await interaction.reply({
        content: "Game already added",
        flags: MessageFlags.Ephemeral
      });
    } catch (_) {
      await database.push(`/${appid}`, {
        name: gameInfo.appName,
        appid: gameInfo.appId,
        buildid: gameInfo.buildId,
        timeUpdated: gameInfo.timeUpdated,
        dateUpdated: gameInfo.dateUpdated,
      });

      interaction.reply({
        content: `Game \`${gameInfo.appName}\` added successfully`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
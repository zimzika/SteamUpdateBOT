import { DatabaseHelper } from "../helpers/Database.helper";
import { SteamAppInfo } from "../helpers/Steam.helper";
import { EmbedBuilder, type Client, type TextChannel } from "discord.js";

export async function CheckUpdateTimer(client: Client) {
  const steam = new SteamAppInfo();
  const db = DatabaseHelper.instance.db;

  await steam.connect();

  try {
    const data: { [key: string]: { name: string, appid: string, buildid: string, timeUpdated: string, dateUpdated: string } } = await db.getData("/");
    const gamesID = Object.keys(data);

    for (const gameID of gamesID) {
      try {
        const appInfo = await steam.getPublicBranchUpdate(Number(gameID));
        if (appInfo.timeUpdated != data[gameID]?.timeUpdated) {
          const guild = await client.guilds.fetch(process.env.DISCORD_GUILD).catch(console.error);
          if (!guild) return;
          const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL).catch(console.error);
          if (!channel) return;

          (channel as TextChannel).send({
            content: "<@1106298160025964605> <@927732922163818527>",
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setTimestamp()
                .setFooter({
                  text: "Developed by HuhRyan"
                })
                .setTitle(`New update for \`${appInfo.appName}\``)
                .setImage(appInfo.appIcon)
            ]
          });
        }
      } catch (_) {
        console.error("[CheckUpdate-CRON] Cannot get appInfo: ", gameID);
      }
    }
  } catch (_) { }
  finally {
    steam.disconnect();
  }
}
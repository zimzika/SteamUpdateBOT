import { DatabaseHelper } from "../helpers/Database.helper";
import { SteamAppInfo } from "../helpers/Steam.helper";
import { EmbedBuilder, type Client, type TextChannel } from "discord.js";

export async function CheckUpdateTimer(client: Client) {
  const db = DatabaseHelper.instance.db;

  try {
    await db.reload();
  } catch (err) {
    console.log("[ReloadDB-CRON] Cannot reload db: ", err);
  }

  const steam = new SteamAppInfo();

  await steam.connect();

  try {
    const data: { [key: string]: { name: string, appid: string, buildid: string, timeUpdated: string, dateUpdated: string } } = await db.getData("/");
    const gamesID = Object.keys(data);

    for (const gameID of gamesID) {
      const appInfo = await steam.getPublicBranchUpdate(Number(gameID)).catch(console.error);
      if (!appInfo) continue;

      try {
        if (appInfo.timeUpdated != data[gameID]?.timeUpdated) {
          await db.push(`/${gameID}`, {
            name: appInfo.appName,
            appid: appInfo.appId,
            buildid: appInfo.buildId,
            timeUpdated: appInfo.timeUpdated,
            dateUpdated: appInfo.dateUpdated,
          });

          const guild = await client.guilds.fetch(process.env.DISCORD_GUILD).catch(console.error);
          if (!guild) return;
          const channel = await guild.channels.fetch(process.env.DISCORD_CHANNEL).catch(console.error);
          if (!channel) return;

          (channel as TextChannel).send({
            content: "@everyone",
            embeds: [
              new EmbedBuilder()
                .setColor("Random")
                .setTimestamp()
                .setFooter({
                  text: "Developed by HuhRyan"
                })
                .setTitle(`New update for \`${appInfo.appName}\``)
            ]
          }).catch(console.error);
        }
      } catch (err) {
        console.error("[CheckUpdate-CRON] Cannot get save DB: ", gameID, err);
      }
    }
  } catch (err) {
    console.error(err);
  }
  finally {
    steam.disconnect();
  }
}
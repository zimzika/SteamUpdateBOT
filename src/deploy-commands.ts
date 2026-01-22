import { REST, Routes } from "discord.js";
import "dotenv/config";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./types/Command.type";

const commands = [];
const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

(async () => {
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command: Command = new (await import(`file:\\\\${filePath}`)).default;

    if ("data" in command && "execute" in command) {
      commands.push(command.data);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing required properties.`);
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    console.log(commands);

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT, process.env.DISCORD_GUILD),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
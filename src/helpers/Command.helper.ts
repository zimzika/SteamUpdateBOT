import type { Command } from "../types/Command.type.js";
import * as fs from "fs";
import path from "path";

export class CommandHelper {
  private static _instance: CommandHelper;

  private commands: Map<string, Command> = new Map();

  public static get instance(): CommandHelper {
    if (!this._instance) {
      this._instance = new CommandHelper();
    }
    return this._instance;
  }

  public async loadCommands(): Promise<void> {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      const command: Command = new (await import(`file:\\\\${filePath}`)).default();

      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
        console.log(`Loaded command: ${command.data.name}`);
      } else {
        console.error(`Command at ${filePath} is missing a name or execute method`);
      }
    }

    console.log(`Loaded ${this.commands.size} commands.`);
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
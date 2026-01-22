import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { CommandHelper } from './helpers/Command.helper.js';
import "dotenv/config";
import { CheckUpdateTimer } from './cron/CheckUpdate.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  CommandHelper.instance.loadCommands();

  CheckUpdateTimer(client);
  setInterval(() => { CheckUpdateTimer(client) }, 60000);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = CommandHelper.instance.getCommand(interaction.commandName);
  if (command) {
    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
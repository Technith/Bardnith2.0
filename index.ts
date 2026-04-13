import { Client, GatewayIntentBits, Events, REST, Routes } from "discord.js";

import { commandData, commands } from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

async function registerCommands() {
  const token = process.env.API_KEY;
  if (!token) throw new Error("MISSING TOKEN");
  const rest = new REST().setToken(token);

  try {
    console.log("Registering slash commands...");
    const guildIds = [
	    process.env.GUILD_IDS,
    ];

    for (const guildId of guildIds) {
	    await rest.put(
		    Routes.applicationGuildCommands(process.env.APP_ID, guildId),
		    { body: commandData }
	    );
	    console.log(`Commands registered for guild ${guildId}`);

    // Use applicationCommands(APP_ID) for non-testing.
    // Takes longer to propigate to all servers
    // Routes.applicationGuildCommands(process.env.APP_ID!,process.env.GUILD_ID!)
    //await rest.put(Routes.applicationCommands(process.env.APP_ID!), {
    //body: commandData,
    //});
    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (command) {
    await command.execute(interaction);
  }
});

registerCommands();
client.login(process.env.API_KEY);

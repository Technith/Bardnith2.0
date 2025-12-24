import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current audio"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guildState = guildManager(interaction.guildId!);
    guildState.player.stop();
    await interaction.reply("Skipped");
  },
};

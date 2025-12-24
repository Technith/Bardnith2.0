import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
} from "discord.js";

import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause/Resume audio"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guildState = guildManager(interaction.guildId!);
    const player = guildState.player;
    if (guildState.isPaused) {
      player.unpause();
      guildState.isPaused = false;
      await interaction.reply("Resumed");
    } else {
      player.pause();
      guildState.isPaused = true;
      await interaction.reply("Paused");
    }
  },
};

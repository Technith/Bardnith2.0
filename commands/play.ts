import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
} from "discord.js";

import { guildManager } from "../state";

import { play } from "../music";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays audio from queue"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guildState = guildManager(interaction.guildId!);
    if (guildState.queue.length === 0) {
      await interaction.reply("Empty Queue");
      return;
    }
    await interaction.reply(`Playing ${guildState.queue[0]}`);
    play(guildState);
  },
};

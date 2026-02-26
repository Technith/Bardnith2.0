import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear queue"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guildState = guildManager(interaction.guildId!);
    guildState.queue.length = 0;
  },
};

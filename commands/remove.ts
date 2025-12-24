import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove URL from queue by index")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("Index of URL to be removed")
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const guildState = guildManager(interaction.guildId!);
    const index = interaction.options.getInteger("index", true);
    await interaction.reply(`Removed: ${guildState.queue[index]}`);
    guildState.queue.splice(index, 1);
  },
};

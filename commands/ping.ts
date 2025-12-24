import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responds with pong"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply("pong");
  },
};

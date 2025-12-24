import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildManager } from "../state";
import { play } from "../music";

export default {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add URL to queue")
    .addStringOption((option) =>
      option.setName("url").setDescription("Youtube URL").setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const url = interaction.options.getString("url");

    if (url == null) {
      await interaction.reply("Empty URL");
      return;
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (url.includes("playlist")) {
        await interaction.reply("Playlists not supported");
        return;
      }
      await interaction.reply(`Added: ${url}`);
      const guildState = guildManager(interaction.guildId!);
      guildState.queue.push(url);
      play(guildState);
    } else {
      await interaction.reply("Invalid URL");
    }
  },
};

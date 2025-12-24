import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
} from "discord.js";

import { joinVoiceChannel, getVoiceConnection } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves user's current Voice Channel"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;

    if (!channel) {
      await interaction.reply("User not in voice channel");
      return;
    }

    const connection = getVoiceConnection(channel.guild.id);
    connection?.destroy();

    await interaction.reply("Left Voice Channel");
  },
};

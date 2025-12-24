import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
} from "discord.js";

import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";

import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins user's current Voice Channel"),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;

    if (!channel) {
      await interaction.reply("User not in voice channel");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const guildState = guildManager(interaction.guildId!);
    const player = guildState.player;

    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(
        `Connected to voice channel: ${channel.name} in ${channel.guild.name}`,
      );
    });

    await interaction.reply(`Joined ${channel.name}`);
  },
};

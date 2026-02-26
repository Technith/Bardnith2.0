import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("List Current Queue"),

  execute: async (interaction: ChatInputCommandInteraction) => {
    let queueString: string = "";
    const guildState = guildManager(interaction.guildId!);
    const numEntries = Math.min(guildState.queue.length, 10);
    for (let i = 0; i < numEntries; i++) {
      queueString += `\n${i + 1} - ${guildState.queue[i]}`;
    }

    if (guildState.queue.length > 10) {
      queueString += `\n + ${guildState.queue.length}`;
    }

    if (!queueString.length) {
      await interaction.reply("Empty Queue");
    } else {
      await interaction.reply(queueString);
    }
  },
};

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildManager } from "../state";

export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("List Current Queue"),

  execute: async (interaction: ChatInputCommandInteraction) => {
    let queueString: string = "";
    const guildState = guildManager(interaction.guildId!);
    for (const [i, item] of guildState.queue.entries()) {
      queueString += `${i} - ${item}\n`;
    }
    if (!queueString.length) {
      await interaction.reply("Empty Queue");
    } else {
      await interaction.reply(queueString);
    }
  },
};

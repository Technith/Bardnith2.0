import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { guildManager } from "../state";
import { play } from "../music";
import { createInterface } from "readline";
import { spawn } from "child_process";

export default {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add URL to queue")
    .addStringOption((option) =>
      option.setName("url").setDescription("Youtube URL").setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const url = interaction.options.getString("url");
    const guildState = guildManager(interaction.guildId!);

    if (url == null) {
      await interaction.reply("Empty URL");
      return;
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (url.includes("list")) {
        const proc = spawn("yt-dlp", [
          "--flat-playlist",
          "--yes-playlist",
          "--dump-json",
          url,
        ]);
        await interaction.reply(`Processing playlist...`);

        const rl = createInterface({ input: proc.stdout });

        rl.on("line", (line) => {
          try {
            const entry = JSON.parse(line);
            guildState.queue.push(
              `https://www.youtube.com/watch?v=${entry.id}`,
            );
          } catch (e) {}
        });

        rl.on("close", () => {
          if (guildState.player.state.status !== AudioPlayerStatus.Playing) {
            interaction.followUp(`Playing ${guildState.queue[0]}`);
            play(guildState);
          }
        });
        return;
      }

      await interaction.reply(`Added: ${url}`);
      guildState.queue.push(url);
      if (guildState.player.state.status !== AudioPlayerStatus.Playing) {
        interaction.followUp(`Playing ${guildState.queue[0]}`);
        play(guildState);
      }
    } else {
      await interaction.reply("Invalid URL");
    }
  },
};

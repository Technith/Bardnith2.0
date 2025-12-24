import { createAudioResource } from "@discordjs/voice";

import { spawn } from "child_process";

import type { GuildState } from "./state";

export function play(guildState: GuildState) {
  if (!guildState.queue.length) {
    return;
  }

  const url = guildState.queue.shift()!;

  const proc = spawn("yt-dlp", [
    "--js-runtimes",
    "bun",
    "--remote-components",
    "ejs:github",
    "-o",
    "-",
    "--format",
    "bestaudio",
    url,
  ]);

  const resource = createAudioResource(proc.stdout);
  guildState.player.play(resource);
}

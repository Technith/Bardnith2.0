import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";

import { play } from "./music";

export interface GuildState {
  isPaused: boolean;
  queue: string[];
  player: AudioPlayer;
}

export const guildStates = new Map<string, GuildState>();

export function guildManager(guildId: string): GuildState {
  if (!guildStates.has(guildId)) {
    const player = createAudioPlayer();

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Playing!");
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log("Idle");
      const guildState = guildStates.get(guildId);
      if (guildState && guildState.queue.length) {
        play(guildState);
      }
    });

    player.on("error", (error) => {
      console.error("Player error:", error);
    });

    guildStates.set(guildId, {
      isPaused: false,
      queue: [],
      player: player,
    });
  }
  return guildStates.get(guildId)!;
}

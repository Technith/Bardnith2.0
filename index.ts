import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  GuildMember,
} from "discord.js";

import {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";

import { spawn } from "child_process";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const player = createAudioPlayer({
  behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("Playing!");
});

player.on(AudioPlayerStatus.Idle, () => {
  console.log("Finished playing");
  play();
});

let isPaused = false;

player.on("error", (error) => {
  console.error("Player error:", error);
});

async function play() {
  const url = queue.shift();

  if (!url) return;

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
  player.play(resource);
  return url;
}

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Replies with pong"),
  new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add URL to queue")
    .addStringOption((option) =>
      option.setName("url").setDescription("Youtube URL").setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove url from queue by index")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("index of url to be removed")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("queue")
    .setDescription("List Current Queue"),
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins user's current Voice Channel"),
  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves user's current Voice Channel"),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays audio from queue"),
  new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses/Resumes audio"),
  new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current audio"),
];

const queue: string[] = [];

async function registerCommands() {
  const token = process.env.API_KEY;
  if (!token) throw new Error("MISSING TOKEN");
  const rest = new REST().setToken(token);

  try {
    console.log("Registering slash commands...");

    // Use applicationCommands(APP_ID) for non-testing.
    // Takes longer to propigate to all servers
    // Routes.applicationGuildCommands(process.env.APP_ID!,process.env.GUILD_ID!)
    await rest.put(Routes.applicationCommands(process.env.APP_ID!), {
      body: commands.map((c) => c.toJSON()),
    });
    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("pong");
  }

  if (commandName === "add") {
    const url = interaction.options.getString("url", true);
    await interaction.reply(`Added: ${url}`);
    queue.push(url);
  }

  if (commandName === "remove") {
    const index = interaction.options.getInteger("index", true);
    await interaction.reply(`Removed: ${queue[index]}`);
    queue.splice(1, index);
  }

  if (commandName === "queue") {
    let queueString: string = "";
    for (const [i, item] of queue.entries()) {
      queueString += `${i} - ${item}\n`;
    }
    await interaction.reply(queueString);
  }

  if (commandName === "join") {
    const memeber = interaction.member as GuildMember;
    const channel = memeber.voice.channel;

    if (!channel) {
      await interaction.reply("User not in voice channel");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(
        `Connected to voice channel: ${channel.name} in ${channel.guild.name}`,
      );
    });

    await interaction.reply(`Joined ${channel.name}`);
  }

  if (commandName === "leave") {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;

    if (!channel) {
      await interaction.reply("Not in voice channel");
      return;
    }

    const connection = getVoiceConnection(channel.guild.id);
    connection?.destroy();

    await interaction.reply("Left Voice Channel");
  }

  if (commandName === "play") {
    if (!queue.length) {
      await interaction.reply("Empty Queue");
      return;
    }

    const nowPlaying = await play();
    await interaction.reply(`Playing: ${nowPlaying}`);
  }

  if (commandName === "pause") {
    if (isPaused) {
      player.unpause();
      isPaused = false;
      await interaction.reply("Resumed");
    } else {
      player.pause();
      isPaused = true;
      await interaction.reply("Paused");
    }
  }

  if (commandName === "skip") {
    player.stop();
    await interaction.reply("Skipped");
  }
});

registerCommands();
client.login(process.env.API_KEY);

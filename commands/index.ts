import play from "./play";
import skip from "./skip";
import add from "./add";
import join from "./join";
import leave from "./leave";
import pause from "./pause";
import ping from "./ping";
import queue from "./queue";
import remove from "./remove";

const commandList = [play, skip, add, join, leave, pause, ping, queue, remove];

export const commands = new Map<string, any>();
for (const cmd of commandList) {
  commands.set(cmd.data.name, cmd);
}

export const commandData = commandList.map((cmd) => cmd.data.toJSON());

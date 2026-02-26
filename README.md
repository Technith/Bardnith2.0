# Bardnith 2.0

Discord bot that plays YouTube audio.

Started in C# but joining voice channels with Discord.NET was broken/outdated on account of end-to-end encryption changes by Discord so I had to redo everything in TypeScript.

## Commands

- `/join`
- `/leave`
- `/play <youtube url>`
- `/skip`
- `/pause` - toggles pause on/off
- `/add <youtube url>` - adds to queue
- `/remove <index>` - removes from queue
- `/queue` - shows the queue
- `/clear` - clears the current queue

Uses yt-dlp under the hood.

Supports individual videos and playlists.

import { resolve } from "path";

export const botName = process.env.BOT_NAME?.length ? process.env.BOT_NAME : "Clytage Bot";
export const stickerPack = process.env.STICKER_PACK?.length
    ? process.env.STICKER_PACK
    : "Clytage Sticker Pack";
export const prefix = process.env.PREFIX?.length ? process.env.PREFIX : "/";
export const devs = process.env.DEVS?.split(",") ?? [];
export const isDev = process.env.NODE_ENV === "development";
process.env.FFMPEG_PATH = resolve("node_modules", "ffmpeg-static", "ffmpeg.exe");

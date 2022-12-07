import { resolve } from "path";

export const botName = process.env.BOT_NAME?.length
    ? process.env.BOT_NAME
    : "Clytage Bot";
export const prefix = process.env.PREFIX?.length ? process.env.PREFIX : "/";
export const devs = process.env.DEVS?.split(",") ?? [];
export const mode = (process.env.MODE as "dev" | "prod" | undefined) ?? "prod";
process.env.FFMPEG_PATH = resolve(
    "node_modules",
    "ffmpeg-static",
    "ffmpeg.exe"
);

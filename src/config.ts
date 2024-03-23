/* eslint-disable @typescript-eslint/naming-convention */
export const BOT_NAME = process.env.BOT_NAME?.length
    ? process.env.BOT_NAME
    : "Stegripe WhatsApp Bot";
export const STICKER_PACK_NAME = process.env.STICKER_PACK_NAME?.length
    ? process.env.STICKER_PACK
    : "Stegripe Sticker Pack";
export const PREFIX = process.env.PREFIX!;
export const ISDEV = process.env.NODE_ENV === "development";
export const DEVS = process.env.DEVS?.split(",") ?? [];
export const WS = process.env.WS!;

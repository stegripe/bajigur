import { Utils } from "../utils/Utils.js";

// Boolean values
export const prefix = process.env.PREFIX ?? "/";

// String values
export const botName = process.env.BOT_NAME?.length ?
    process.env.BOT_NAME :
    "Clytage Bot";

// Multiple values
export const devs: string[] = Utils.parseEnvValue(process.env.DEVS ?? "");

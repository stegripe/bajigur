import { Utils } from "../utils/Utils.js";

// Boolean Values
export const prefix = process.env.PREFIX ?? "/";

// String Values
export const botName = process.env.BOT_NAME?.length
    ? process.env.BOT_NAME
    : "Clytage Bot";

// Multiple Values
export const devs: string[] = Utils.parseEnvValue(process.env.DEVS ?? "");

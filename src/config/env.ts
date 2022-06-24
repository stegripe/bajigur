import { ProjectUtils } from "../utils/structures/ProjectUtils";

// Boolean values
export const prefix = process.env.PREFIX ?? "/";

// String values
export const botName = process.env.BOT_NAME?.length
    ? process.env.BOT_NAME
    : "Clytage Bot";

// Multiple values
export const devs: string[] = ProjectUtils.parseEnvValue(
    process.env.DEVS ?? ""
);

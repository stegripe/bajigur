import BajigurClient from "./structures/BajigurClient.js";

const client = new BajigurClient();

process.on("unhandledRejection", (error: Error) => {
    client.logger.error(`Unhandled Rejection: ${error.stack ?? error.message}`);
});

process.on("uncaughtException", error => {
    client.logger.error(`Uncought Exception: ${error.stack ?? error.message}`);
    process.exit(1);
});

await client.connect();

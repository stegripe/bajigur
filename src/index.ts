import BajigurClient from "./structures/BajigurClient.js";

const client = new BajigurClient();

process.on("unhandledRejection", e => {
    client.logger.error("Unhandled Rejection:", e);
});

process.on("uncaughtException", error => {
    client.logger.error("Uncaught Exception:", error.stack ?? error.message);
    client.logger.warn(
        "uncaught exception",
        "Fatal error has been detected. Exiting processing..."
    );
    process.exit(1);
});

await client.connect();

import { makeWASocket, makeCacheableSignalKeyStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { isDev, prefix } from "./config/env.js";
import { WhatsAppBot } from "./structures/WhatsAppBot.js";
import { container } from "@sapphire/pieces";
import { createLogger } from "@clytage/liqueur";

const logger = createLogger({
    name: "WhatsApp-bot",
    debug: isDev
});

const client = new WhatsAppBot({
    baseUserDirectory: "dist",
    fetchPrefix: () => Promise.resolve(prefix),
    async makeWASocket() {
        container.authState = await useMultiFileAuthState("auth_state");
        return makeWASocket({
            auth: {
                creds: container.authState.state.creds,
                // @ts-expect-error-next-line
                keys: makeCacheableSignalKeyStore(container.authState.state.keys, logger)
            },
            printQRInTerminal: true,
            // @ts-expect-error-next-line
            logger
        });
    },
    logger
});

await client.login();

declare module "@sapphire/pieces" {
    interface Container {
        authState: Awaited<ReturnType<typeof useMultiFileAuthState>>
    }
}

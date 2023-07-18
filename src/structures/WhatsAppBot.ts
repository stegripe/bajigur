import { CommandHandler, ListenerHandler } from "../utils/structures";
import { IWhatsAppBotConfig } from "../types";
import * as Config from "../config";
import makeWASocket, { AuthenticationState, makeCacheableSignalKeyStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { resolve } from "node:path";
import pretty from "pino-pretty";
import pino from "pino";

export class WhatsAppBot {
    public socket: ReturnType<typeof makeWASocket> | undefined;
    public authState:
        | { state: AuthenticationState; saveCreds: () => Promise<void> }
        | undefined;

    public readonly config: IWhatsAppBotConfig = Config;

    public readonly logger = pino(
        {
            level: this.config.mode === "prod" ? "info" : "debug",
            timestamp: true
        },
        pretty({
            translateTime: "SYS:yyyy-MM-dd HH:mm:ss"
        })
    );

    public readonly commandHandler = new CommandHandler(
        this,
        resolve("dist/commands")
    );

    public readonly listenerHandler = new ListenerHandler(
        this,
        resolve("dist/events")
    );

    public async start(): Promise<void> {
        this.authState = await useMultiFileAuthState("auth_state");
        this.socket = makeWASocket({
            auth: {
                creds: this.authState.state.creds,
                keys: makeCacheableSignalKeyStore(this.authState.state.keys, this.logger),
            },
            printQRInTerminal: true,
            logger: this.logger
        });
        await this.listenerHandler.init();
    }
}

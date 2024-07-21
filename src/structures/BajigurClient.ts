import ImportURLToString from "#bajigur/utils/ImportURLToString.js";
import { ISDEV } from "#bajigur/config.js";
import { ListenerHandler } from "./Listener.js";
import { CommandHandler } from "./Command.js";
import {
    makeCacheableSignalKeyStore,
    makeWASocket,
    useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Logger, pino } from "pino";
import { resolve } from "path";

export default class BajigurClient {
    public socket?: ReturnType<typeof makeWASocket>;
    public authState?: Awaited<Promise<ReturnType<typeof useMultiFileAuthState>>>;
    public readonly logger: Logger = pino({
        name: "Bajigur",
        formatters: {
            bindings: () => ({ pid: `Bajigur@${process.pid}` })
        },
        level: ISDEV ? "debug" : "info",
        timestamp: true,
        transport: {
            targets: [
                {
                    target: "pino-pretty",
                    level: ISDEV ? "debug" : "info",
                    options: { translateTime: "SYS:yyyy-mm-dd HH:MM:ss" }
                }
            ]
        }
    });

    public readonly commands = new CommandHandler(
        this,
        resolve(ImportURLToString(import.meta.url), "..", "commands")
    );

    public readonly listeners = new ListenerHandler(
        this,
        resolve(ImportURLToString(import.meta.url), "..", "listeners")
    );

    public async connect(): Promise<void> {
        this.authState = await useMultiFileAuthState("auth_state");
        this.socket = makeWASocket({
            logger: this.logger,
            auth: {
                creds: this.authState.state.creds,
                keys: makeCacheableSignalKeyStore(this.authState.state.keys, this.logger)
            },
            printQRInTerminal: true
        });
        await this.listeners.init();
    }
}

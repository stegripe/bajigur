import { ev } from "@open-wa/wa-automate";
import { resolve } from "node:path";
import { WhatsappBot } from "../../structures/WhatsappBot.js";
import { IListenerComponent } from "../../types/index.js";
import { Utils } from "../Utils.js";

export class ListenerHandler {
    public constructor(
        public readonly client: WhatsappBot,
        public readonly path: string
    ) {}

    public async load(): Promise<void> {
        const fileListeners = Utils.readdirRecursive(this.path);
        try {
            for (const file of fileListeners) {
                const listener = await Utils.import<IListenerComponent>(
                    resolve(file),
                    this.client
                );
                if (listener === undefined) {
                    this.client.logger.error(
                        "listener handler",
                        `File ${file} is not valid listener file`
                    );
                    return;
                }
                ev.addListener(listener.meta.event, (...args) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    listener.execute(...args)
                );
            }
        } catch (e) {
            this.client.logger.error(
                "listener handler",
                "Listener Handler Err: ",
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.client.logger.info(
                "listener handler",
                `Done Registering ${fileListeners.length} command(s).`
            );
        }
    }
}

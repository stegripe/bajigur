import { WhatsAppBot } from "../../structures/WhatsAppBot.js";
import { IListenerComponent } from "../../types/index.js";
import { Utils } from "../Utils.js";
import { ev } from "@open-wa/wa-automate";

export class ListenerHandler {
    public constructor(
        public readonly whatsappbot: WhatsAppBot,
        public readonly path: string
    ) {}

    public async load(): Promise<void> {
        const fileListeners = Utils.readdirRecursive(this.path);
        let unableToLoad = 0;
        try {
            this.whatsappbot.logger.info(
                "listener handler",
                `Loading ${fileListeners.length} listener(s).`
            );
            for (const file of fileListeners) {
                const listener = await Utils.import<IListenerComponent>(
                    file,
                    this.whatsappbot
                );
                if (listener === undefined) {
                    this.whatsappbot.logger.error(
                        "listener handler",
                        `File ${file} is not valid listener file`
                    );
                    unableToLoad++;
                    continue;
                }
                ev.addListener(listener.meta.event, (...args) =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    listener.execute(...args)
                );
            }
        } catch (e) {
            this.whatsappbot.logger.error(
                "listener handler",
                "Listener Handler Err: ",
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.whatsappbot.logger.info(
                "listener handler",
                `Done Registering ${
                    fileListeners.length - unableToLoad
                } listener(s).`
            );
        }
    }
}

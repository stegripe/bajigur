import { ev } from "@open-wa/wa-automate";
import { WhatsappBot } from "../../structures/WhatsappBot";
import { IListenerComponent } from "../../types";
import { ProjectUtils } from "./ProjectUtils";

export class ListenerHandler {
    public constructor(
        public readonly whatsappbot: WhatsappBot,
        public readonly path: string
    ) {}

    public async load(): Promise<void> {
        let invalidFile = 0;
        const fileListeners = ProjectUtils.readdirRecursive(this.path);
        try {
            this.whatsappbot.logger.info(
                "listener handler",
                `Loading ${fileListeners.length} listener(s).`
            );
            for (const file of fileListeners) {
                const listener = await ProjectUtils.import<IListenerComponent>(
                    file,
                    this.whatsappbot
                );
                if (listener) {
                    ev.addListener(listener.meta.event, (...args) =>
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        listener.execute(...args)
                    );
                } else {
                    this.whatsappbot.logger.error(
                        "listener handler",
                        `File ${file} is not valid listener file`
                    );
                    invalidFile++;
                    continue;
                }
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
                `Done Registering ${fileListeners.length - invalidFile}/${
                    fileListeners.length
                } command(s).`
            );
        }
    }
}

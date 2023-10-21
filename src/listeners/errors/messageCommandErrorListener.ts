import { Events, Listener, ListenerOptions } from "@clytage/liqueur";
import { ApplyOptions } from "@nezuchan/decorators";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandError
})
export class messageCommandError extends Listener {
    public run(error: unknown): void {
        return this.container.client.logger.error(error);
    }
}
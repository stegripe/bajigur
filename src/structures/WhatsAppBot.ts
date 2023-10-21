import { FrameworkClient, FrameworkClientOptions } from "@clytage/liqueur";

export class WhatsAppBot extends FrameworkClient {
    public constructor(public readonly options: FrameworkClientOptions) {
        super(options);
    }
}

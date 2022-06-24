import { WhatsappBot } from "./structures/WhatsappBot";

new WhatsappBot({
    headless: true,
    qrTimeout: 0,
    chromiumArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    ezqr: true,
    popup: (process.env.PORT ? Number(process.env.PORT) : undefined) ?? false
});

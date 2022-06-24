import { Message } from "@open-wa/wa-automate";

export interface ICommandComponent {
    meta: {
        name: string;
        aliases?: string[];
        description?: string;
        usage?: string;
        devOnly?: boolean;
        disabled?: boolean;
        readonly category?: string;
    };
    execute: (message: Message, ...args: any) => void;
}

export interface IListenerComponent {
    meta: {
        event: string;
    };
    execute: (...args: any) => void;
}

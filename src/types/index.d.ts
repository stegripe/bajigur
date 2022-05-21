import { Message } from "@open-wa/wa-automate";

export interface ICommandComponent {
    meta: {
        name: string;
        description: string;
        aliases: string[];
        usage: string;
        devOnly: boolean;
        disabled: boolean;
    };
    execute: (message: Message, ...args: any) => void;
}

export interface IListenerComponent {
    meta: {
        event: string;
    };
    execute: (...args: any) => void;
}

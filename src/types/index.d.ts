export interface ICommandComponent {
    meta: {
        name: string;
        description: string;
        aliases: string[];
        usage: string;
    };
    execute: (...args: any) => void;
}

export interface IListenerComponent {
    meta: {
        event: string;
    };
    execute: (...args: any) => void;
}

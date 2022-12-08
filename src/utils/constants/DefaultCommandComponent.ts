import { ICommandComponent } from "../../types";

export const DefaultCommandComponent: ICommandComponent["meta"] = {
    name: "",
    aliases: [],
    description: "",
    usage: "",
    devOnly: false,
    category: ""
};

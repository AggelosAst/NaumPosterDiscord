import {Client, Collection} from "discord.js";
import {Command} from "./command";

export interface ModifiedClient extends Client {
    commands?: Collection<string, Command>
}
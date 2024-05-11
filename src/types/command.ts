import {CommandInteraction, SlashCommandBuilder} from "discord.js";

export type Command = {
    data: typeof SlashCommandBuilder | {name: string},
    execute: (interaction: CommandInteraction) => Promise<void>,
}
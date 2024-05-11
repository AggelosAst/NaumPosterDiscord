import {SlashCommandBuilder} from "discord.js";

export interface SlashDMCommand extends SlashCommandBuilder {
    integration_types: number[],
    contexts: number[]
}
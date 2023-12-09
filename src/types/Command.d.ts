import type {
    ChatInputCommandInteraction,
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface Command {
    data: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

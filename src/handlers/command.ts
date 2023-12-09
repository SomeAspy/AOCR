import type { ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../types/Command.js";

export async function handleCommand(
    interaction: ChatInputCommandInteraction,
    commands: Map<string, Command>,
) {
    try {
        await commands.get(interaction.commandName)?.execute(interaction);
    } catch (error) {
        await interaction.reply({
            content: `${error}`,
            ephemeral: true,
        });
    }
}

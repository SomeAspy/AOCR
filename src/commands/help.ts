import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { readFile } from "fs/promises";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Bot FAQ");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
        ephemeral: true,
        content: await readFile("docs/FAQ.md", "utf8"),
    });
}

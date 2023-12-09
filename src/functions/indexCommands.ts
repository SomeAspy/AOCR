import { readdir } from "fs/promises";
import { Command } from "../types/Command.js";
import { SlashCommandOptionsOnlyBuilder } from "discord.js";

export const commandData: SlashCommandOptionsOnlyBuilder[] = [];
export const commands: Map<string, Command> = new Map();

export async function indexCommands() {
    for (const file of await readdir("src/commands")) {
        const command = (await import(
            `../commands/${file}.js`.replace(".ts", "")
        )) as Command;
        commandData.push(command.data);
        commands.set(command.data.name, command);
    }
}

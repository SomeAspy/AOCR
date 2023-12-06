import { REST, Routes } from "discord.js";
import untypedConfig from "../../config/config.json" assert { type: "json" };
import type { Config } from "../types/Config.js";
import { data } from "./helpCommand.js";

const config = untypedConfig as Config;

const restAPI = new REST({ version: "10" }).setToken(config.DiscordToken);

export async function pushHelpCommand() {
    if (!config.BotID) {
        console.log("NOT pushing help command, no BotID supplied.");
        return;
    }
    try {
        console.log("Attempting to push Help command...");
        await restAPI.put(Routes.applicationCommands(config.BotID), {
            body: [data],
        });
    } catch (error) {
        console.error(error);
    }
}

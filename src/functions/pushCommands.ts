import { REST, Routes } from "discord.js";
import untypedConfig from "../../config/config.json" assert { type: "json" };
import type { Config } from "../types/Config.js";
import { commandData } from "./indexCommands.js";

const config = untypedConfig as Config;
const restAPI = new REST({ version: "10" }).setToken(config.DiscordToken);

export async function pushCommands() {
    try {
        console.log(`Attempting to push ${commandData.length} commands...`);
        await restAPI.put(Routes.applicationCommands(config.BotID!), {
            // This function is only run when BotID exists
            body: commandData,
        });
    } catch (error) {
        console.error(error);
    }
}

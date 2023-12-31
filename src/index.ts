import {
    Client,
    GatewayIntentBits,
    Events,
    type Message,
    Partials,
} from "discord.js";
import untypedConfig from "../config/config.json" assert { type: "json" };
import type { Config } from "./types/Config.js";

const config = untypedConfig as Config;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Reaction, Partials.Message], // We need these partials to get messages and reactions sent before the bot started
});

client.once(Events.ClientReady, () => {
    console.log("Connected to Discord!");
});

import { handleMessage } from "./handlers/message.js";
client.on(Events.MessageCreate, async (message) => {
    if (
        message.attachments.at(0) ||
        message.embeds.at(0) ||
        (message.stickers.at(0) && config.CheckStickers) ||
        config.CheckEmojis
    ) {
        try {
            await handleMessage(message);
        } catch (error) {
            console.error(error);
        }
    }
});

client.on(Events.MessageUpdate, async (message) => {
    if (
        message.attachments.at(0) ||
        message.embeds.at(0) ||
        message.stickers.size != 0
    ) {
        try {
            await handleMessage(message as Message);
        } catch (error) {
            console.error(error);
        }
    }
});

if (config.CheckReactions) {
    client.on(Events.MessageReactionAdd, async (reaction) => {
        if (reaction.partial) {
            reaction = await reaction.fetch();
        }
        if (reaction.count != 1) {
            return;
        }
        try {
            await handleReaction(reaction);
        } catch (error) {
            console.error(error);
        }
    });
}

client.on(Events.Error, (error) => console.error(error));
client.on(Events.Warn, (warning) => console.warn(warning));

import { ocr } from "./libs/tesseract.js";
import { handleReaction } from "./handlers/reaction.js";
client.on(Events.Invalidated, async () => {
    console.log("Session Invalidated - Stopping Client");
    await ocr.terminate();
    await client.destroy();
    process.exit(1);
});

await client.login(config.DiscordToken);

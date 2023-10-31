import { Client, GatewayIntentBits, Events, Message } from 'discord.js';
import untypedCredentials from '../config/credentials.json' assert { type: 'json' };
import type { Credentials } from './types/Credentials.js';
const credentials = untypedCredentials as Credentials;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
});

client.once(Events.ClientReady, () => {
    console.log('Connected to Discord!');
});

import { handleMessage } from './handlers/message.js';
import { ocr } from './libs/tesseract.js';
client.on(Events.MessageCreate, async (message) => {
    if (message.attachments.at(0) || message.embeds.at(0)) {
        try {
            await handleMessage(message);
        } catch (error) {
            console.error(error);
        }
    }
});

client.on(Events.MessageUpdate, async (message) => {
    if (message.attachments.at(0) || message.embeds.at(0)) {
        try {
            await handleMessage(message as Message);
        } catch (error) {
            console.error(error);
        }
    }
});

client.on(Events.Error, (error) => console.error(error));
client.on(Events.Warn, (warning) => console.warn(warning));
client.on(Events.Invalidated, async () => {
    console.log('Session Invalidated - Stopping Client');
    await ocr.terminate();
    await client.destroy();
    process.exit(1);
});

await client.login(credentials.DiscordToken);

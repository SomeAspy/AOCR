import { Message, PermissionsBitField } from "discord.js";
import { processImage } from "../functions/processImage.js";

import untypedConfig from "../../config/config.json" assert { type: "json" };
import type { Config } from "../types/Config.js";
const config = untypedConfig as Config;

export async function handleMessage(message: Message) {
    if (
        message.author.bot ||
        !message.inGuild() ||
        (!config.ApplyToModerators &&
            message.member?.permissions.has(
                PermissionsBitField.Flags.ManageGuild,
                true,
            ))
    ) {
        return;
    }
    const imagesToCheck: string[] = [];
    if (message.embeds) {
        for (const embed of message.embeds) {
            if (embed.url) {
                imagesToCheck.push(embed.url);
            }
        }
    }
    if (message.attachments) {
        message.attachments.forEach((attachment) => {
            imagesToCheck.push(attachment.url);
        });
    }
    for await (const image of imagesToCheck) {
        await processImage(image, message);
    }
}

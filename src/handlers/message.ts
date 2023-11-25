import { Message, PermissionsBitField } from "discord.js";
import { process } from "../functions/process.js";

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
    if (config.CheckStickers && message.stickers) {
        message.stickers.forEach((sticker) => {
            imagesToCheck.push(sticker.url);
        });
    }
    if (config.CheckEmojis && message.content) {
        /<:.+?:[0-9]+?>/g.exec(message.content)?.forEach((emojiDeclaration) => {
            const emojiId = /:[0-9].+[0-9]>/
                .exec(emojiDeclaration)
                ?.at(0)
                ?.slice(1)
                .slice(0, -1)
                .toString();
            if (emojiId) {
                imagesToCheck.push(
                    `https://cdn.discordapp.com/emojis/${emojiId}.webp?size=max&quality=lossless`,
                );
            }
        });
    }

    for (const image of imagesToCheck) {
        await process(message.member!, message, image);
    }
}

import {
    AutoModerationActionType,
    type AutoModerationAction,
    Message,
    type GuildMember,
    type MessageReaction,
    type TextBasedChannel,
    EmbedBuilder
} from "discord.js";
import type Tesseract from "tesseract.js";

import untypedConfig from "../../config/config.json" with {type: "json"};
import type {Config} from "../types/Config.js";
const config = untypedConfig as Config;

export async function runActions(
    member: GuildMember,
    automodActions: AutoModerationAction[],
    event: Message | MessageReaction,
    ocrData: Tesseract.RecognizeResult,
    imageUrl: string
) {
    const blockRule = automodActions.find((rule) => rule.type == AutoModerationActionType.BlockMessage);
    const alertRule = automodActions.find((rule) => rule.type == AutoModerationActionType.SendAlertMessage);
    const timeoutRule = automodActions.find((rule) => rule.type == AutoModerationActionType.Timeout);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: member.user.username,
            iconURL: member.user.displayAvatarURL()
        })
        .addFields({name: "AOCR Recognized:", value: ocrData.data.text})
        .addFields({
            name: "Result Confidence:",
            value: `${ocrData.data.confidence.toString()}%`
        })
        .setImage(imageUrl);

    if (timeoutRule) {
        if (member.moderatable && !config.OnlyDelete) {
            try {
                await member.timeout(
                    timeoutRule.metadata.durationSeconds! * 1000,
                    timeoutRule.metadata.customMessage ? timeoutRule.metadata.customMessage : "AOCR: Rule Broken"
                );
            } catch {
                // Do nothing.
            }
        }
    }

    if (alertRule) {
        try {
            await (event.client.channels.cache.get(alertRule.metadata.channelId!) as TextBasedChannel).send({
                embeds: [embed]
            });
        } catch {
            // Do nothing.
        }
    }

    if (blockRule) {
        try {
            await member.send({
                content: blockRule.metadata.customMessage ? blockRule.metadata.customMessage : "AOCR: Rule Broken",
                embeds: [embed]
            });
        } catch {
            // Do nothing.
        }
        try {
            if (event instanceof Message) {
                if (event.deletable) {
                    await event.delete();
                }
            } else {
                await event.remove();
            }
        } catch {
            // Do nothing.
        }
    }
}

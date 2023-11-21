import {
    AutoModerationAction,
    AutoModerationActionType,
    EmbedBuilder,
    Message,
    TextBasedChannel,
} from "discord.js";
import Tesseract from "tesseract.js";

import untypedConfig from "../../config/config.json" assert { type: "json" };
import type { Config } from "../types/Config.js";
const config = untypedConfig as Config;

export async function runActions(
    automodRules: AutoModerationAction[],
    message: Message,
    ocrData: Tesseract.RecognizeResult,
) {
    const blockRule = automodRules.find(
        (rule) => rule.type == AutoModerationActionType.BlockMessage,
    );
    const alertRule = automodRules.find(
        (rule) => rule.type == AutoModerationActionType.SendAlertMessage,
    );
    const timeoutRule = automodRules.find(
        (rule) => rule.type == AutoModerationActionType.Timeout,
    );

    //we are doing it this way to keep a constant order of operations

    if (timeoutRule) {
        if (message.member?.moderatable && !config.OnlyDelete) {
            await message.member.timeout(
                timeoutRule.metadata.durationSeconds! * 1000,
                "Automod OCR: Rule broken",
            );
        }
    }

    const embed = new EmbedBuilder()
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp(Date.now())
        .addFields({ name: "OCR recognized:", value: ocrData.data.text })
        .addFields({
            name: "OCR Confidence:",
            value: `${ocrData.data.confidence}%`,
        });

    if (alertRule) {
        const channel = message.client.channels.cache.get(
            alertRule.metadata.channelId!,
        )!;

        await (channel as TextBasedChannel).send({ embeds: [embed] });
    }

    if (blockRule) {
        let dmMessage = "Your image has been blocked!";
        if (blockRule.metadata.customMessage) {
            dmMessage += ` Reason: ${blockRule.metadata.customMessage}`;
        }
        try {
            await message.author.send({
                content: dmMessage,
                embeds: [embed],
            });
        } catch (e) {
            //do nothing.
        }
        if (message.deletable) {
            await message.delete();
        }
    }
}

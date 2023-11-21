import { AutoModerationRuleTriggerType, Message } from "discord.js";
import { ocr } from "../libs/tesseract.js";
import Tesseract from "tesseract.js";
import { runActions } from "./runActions.js";

export async function processImage(imageUrl: string, message: Message) {
    // including message as a param is guh, but whatever.
    if (!message.guild) {
        return;
    }
    const autoModRules = await message.guild.autoModerationRules.fetch();
    const ocrResult: Tesseract.RecognizeResult = await ocr.addJob(
        "recognize",
        imageUrl,
    );
    const ocrText = ocrResult.data.text;
    for (let ruleNumber = 0; ruleNumber < autoModRules.size; ++ruleNumber) {
        const rule = autoModRules.at(ruleNumber)!;

        if (
            message.member!.roles.cache.some((role) =>
                rule.exemptRoles.has(role.id),
            ) ||
            rule.exemptChannels.has(message.channelId)
        ) {
            return;
        }

        let filteredOcr = ocrText;
        filteredOcr = filteredOcr.replaceAll("\n", ""); //Tesseract inserts newline characters
        rule.triggerMetadata.allowList.forEach((word) => {
            filteredOcr = filteredOcr.replaceAll(word, "");
        });

        if (
            rule.triggerType == AutoModerationRuleTriggerType.MentionSpam ||
            rule.triggerType == AutoModerationRuleTriggerType.Spam ||
            !rule.enabled
        ) {
            continue;
        }

        if (rule.triggerMetadata.keywordFilter) {
            for (
                let keywordNumber = 0;
                keywordNumber < rule.triggerMetadata.keywordFilter.length;
                ++keywordNumber
            ) {
                const keyword =
                    rule.triggerMetadata.keywordFilter[keywordNumber]!;
                if (filteredOcr.includes(keyword)) {
                    try {
                        await runActions(rule.actions, message, ocrResult);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        if (rule.triggerMetadata.regexPatterns) {
            for (
                let regexNumber = 0;
                regexNumber < rule.triggerMetadata.regexPatterns.length;
                ++regexNumber
            ) {
                const ruleRegex = new RegExp(
                    rule.triggerMetadata.regexPatterns[regexNumber]!,
                );
                if (ruleRegex.test(filteredOcr)) {
                    try {
                        await runActions(rule.actions, message, ocrResult);
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }
            }
        }
    }
}

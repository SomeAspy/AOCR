import { AutoModerationRuleTriggerType, Message } from 'discord.js';
import { ocr } from '../libs/tesseract.js';
import Tesseract from 'tesseract.js';

export async function processImage(imageUrl: string, message: Message) {
    // including message as a param is guh, but whatever.
    const autoModRules = await message.guild!.autoModerationRules.fetch(); // should double check this exists
    const ocrResult: Tesseract.RecognizeResult = await ocr.recognize(imageUrl);
    const ocrText = ocrResult.data.text;
    console.log(ocrText);
    for (let ruleNumber = 0; ruleNumber < autoModRules.size; ++ruleNumber) {
        const rule = autoModRules.at(ruleNumber)!;

        let filteredOcr = ocrText;
        rule.triggerMetadata.allowList.forEach((word) => {
            filteredOcr = filteredOcr.replaceAll(word, '');
        });

        if (
            rule.triggerType == AutoModerationRuleTriggerType.MentionSpam ||
            rule.triggerType == AutoModerationRuleTriggerType.Spam ||
            !rule.enabled
        ) {
            continue;
        }
        console.log(rule.toJSON());

        if (rule.triggerMetadata.keywordFilter) {
            for (
                let keywordNumber = 0;
                keywordNumber < rule.triggerMetadata.keywordFilter.length;
                ++keywordNumber
            ) {
                const keyword =
                    rule.triggerMetadata.keywordFilter[keywordNumber]!;
                if (filteredOcr.includes(keyword)) {
                    //TODO: RUN AUTOMOD ACTIONS
                    await message.reply('nuh uh (keyword)');
                    return;
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
                    //TODO: RUN AUTOMOD ACTIONS
                    await message.reply('nuh uh (regex)');
                    return;
                }
            }
        }
    }
}

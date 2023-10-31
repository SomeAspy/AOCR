import { Message, PermissionsBitField } from 'discord.js';
import { ocr } from '../libs/tesseract.js';

export async function handleMessage(message: Message) {
    if (
        message.author.bot ||
        !message.inGuild() // ||
        //message.member?.permissions.has(
        //    PermissionsBitField.Flags.ManageGuild,
        //    true,
        //)
    ) {
        return;
    }
    const autoModRules = await message.guild.autoModerationRules.fetch();
    // autoModRules.forEach((rule) => {
    //     console.log(rule.toJSON());
    // });
    const imagesToCheck = [];
    if (message.embeds) {
        for await (const embed of message.embeds) {
            const ocrData = await ocr.recognize(embed.url!);
            console.log(
                `${ocrData.data.text}: ${ocrData.data.confidence}% confident`,
            );
        }
    }
    if (message.attachments) {
        for (let i = 0; i < message.attachments.size; ++i) {
            const ocrData = await ocr.recognize(message.attachments.at(i)!.url);
            console.log(ocrData.data.text);
        }
    }
}

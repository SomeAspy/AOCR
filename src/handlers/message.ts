import { Message, PermissionsBitField } from 'discord.js';
import { processImage } from '../functions/processImage.js';

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

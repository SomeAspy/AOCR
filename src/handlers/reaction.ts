import { MessageReaction } from "discord.js";
import { processImage } from "../functions/processImage.js";

export async function handleReaction(reaction: MessageReaction) {
    if (
        reaction.users.cache.at(0)?.bot ||
        !reaction.message.inGuild() ||
        reaction.emoji.imageURL() == null
    ) {
        return;
    }
    await processImage(
        reaction.emoji.imageURL({ size: 4096 })!,
        reaction.message, //THIS WILL CAUSE PUNISHMENTS TO BE APPLIED TO THE MESSAGE AUTHOR, NOT THE REACTOR
    );
}

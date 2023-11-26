import { MessageReaction } from "discord.js";
import { process } from "../functions/process.js";
import { MessageReactionExtended } from "../types/extensions.js";

export async function handleReaction(reaction: MessageReaction) {
    if (reaction.message.partial) {
        reaction.message = await reaction.message.fetch();
    }
    let user = reaction.users.cache.at(0);
    if (!user) {
        user = (await reaction.users.fetch()).at(0);
    }
    if (
        !user ||
        user.bot ||
        !reaction.message.inGuild() ||
        reaction.emoji.imageURL() == null
    ) {
        return;
    }

    const extendedReaction = reaction as MessageReactionExtended;
    extendedReaction.channelId = reaction.message.channelId;
    extendedReaction.guild = reaction.message.guild;

    await process(
        await reaction.message.guild.members.fetch(user),
        extendedReaction,
        reaction.emoji.imageURL({ size: 4096 })!,
    );
}

import { MessageReaction } from "discord.js";
import { process } from "../functions/process.js";
import { MessageReactionExtended } from "../types/extensions.js";

export async function handleReaction(reaction: MessageReaction) {
    if (reaction.partial) {
        reaction = await reaction.fetch();
        reaction.message = await reaction.message.fetch();
    }
    if (
        !reaction.users.cache.at(0) ||
        reaction.users.cache.at(0)?.bot ||
        !reaction.message.inGuild() ||
        reaction.emoji.imageURL() == null
    ) {
        return;
    }

    const reactor = await reaction.message.guild.members.fetch(
        reaction.users.cache.at(0)!, // this will not be undefined, see above check.
    );

    const extendedReaction = reaction as MessageReactionExtended;
    extendedReaction.channelId = reaction.message.channelId;
    extendedReaction.guild = reaction.message.guild;

    await process(
        reactor,
        extendedReaction,
        reaction.emoji.imageURL({ size: 4096 })!,
    );
}

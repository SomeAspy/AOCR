import type {Guild, MessageReaction, Snowflake} from "discord.js";

export interface MessageReactionExtended extends MessageReaction {
    guild?: Guild;
    channelId: Snowflake;
}

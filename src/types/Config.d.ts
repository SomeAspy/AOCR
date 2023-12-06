export interface Config {
    DiscordToken: string;
    BotID?: string;
    Workers: number;
    ApplyToModerators: boolean;
    OnlyDelete: boolean;
    CheckEmojis: boolean;
    CheckReactions: boolean;
    CheckStickers: boolean;
}

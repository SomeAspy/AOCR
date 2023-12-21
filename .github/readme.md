# AOCR

> Enhance Discord's automod with image recognition - Works on emojis, reactions, stickers, and more!

![Video Demo](https://github.com/SomeAspy/AOCR/assets/33640860/4d8be2f5-ce98-4b92-bfe6-88424ab23c99)

## Invite

<https://discord.com/api/oauth2/authorize?client_id=1168700227201548409&permissions=1099511639072&scope=bot>

> [!IMPORTANT]
> The production bot does not apply automod rules to admins/users with manage server, similar to standard automod

## To Host Yourself

1. Create a discord bot with the following permissions ([Detailed guide from Discord.JS](https://discordjs.guide/preparations/setting-up-a-bot-application.html)):
    - ***ENABLE THE MESSAGE CONTENT INTENT***
    - Send Messages (To send messages to the automod channel)
    - Manage Messages (To delete offending messages)
    - Manage Server (To view AutoMod rules)
    - Read Messages/View Channels (To view messages and images contained within)
    - Moderate Members (To apply moderation actions to members)
2. Add the bot to your server
3. Clone this repository (`git clone https://github.com/SomeAspy/AOCR`)
4. Set configs in `config/config.json` (copy `config.example.json` and rename the copy to `config.json`)
    - `DiscordToken`: This will be your bots Discord Token.
    - `Workers`: The amount of workers the bot will have for OCR. Each worker takes about 100mb RAM. (Default: `5`)
    - `ApplyToModerators`: Whether to apply AOCR detection to admins and members with manage server. (Default: `false`)
    - `OnlyDelete`: This will only delete messages instead of applying all automod rules. (Default: `false`)
    - `CheckEmojis`: Check emojis with OCR. This requires processing **EVERY** message with regex. (Default: `false`)
    - `CheckReactions`: Check reactions with OCR. (Default: `true`)
    - `CheckStickers`: Check stickers with OCR. (Default: `true`)
5. Install packages using a node package manager (I suggest [PNPM](https://pnpm.io/)): `pnpm i`
6. Build: `pnpm build`
7. Run: `pnpm start`

### Powered by [Tesseract.js](https://tesseract.projectnaptha.com/)

#### Training data provided by <https://github.com/tesseract-ocr/tessdata_best/blob/main/eng.traineddata>

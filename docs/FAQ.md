# FAQ.md

## Why isn't the bot working?

The bot will not apply automod rules to members with `Administrator` or `Manage Server`. This is the same behavior you will get from regular automod.

If you are self hosting you can change this in the `config.json` file by setting `ApplyToModerators` to `true`

## Why doesn't the bot catch everything?

OCR is not perfect. There are serious gaps in recognition. OCR works best on clear/clean text.

This bot using [Tesseract.js](<https://github.com/naptha/tesseract.js>) with the [English tessdata_best training model (direct download)](https://github.com/tesseract-ocr/tessdata_best/raw/main/eng.traineddata).

## Where can I change settings?

There are no settings to change. The bot automatically pulls from your server's automod configuration and attempts to apply them to images.

## OK, but I *really* want to disable certain aspects

You can self host the bot via the directions on the [GitHub readme](https://github.com/SomeAspy/AOCR). If you go this route, I would appreciate a star!

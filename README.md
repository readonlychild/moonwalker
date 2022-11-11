
This bot is based on this template: [NamVr/DiscordBot-Template](https://github.com/NamVr/DiscordBot-Template#readme) Nov-2022.

# Moonwalker Bot

This bot starts with a command to save discord forum threads to `json` files that can then be used to generate SEO content. 

There is a sidekick project for this here: [link-to-astro-moonwalks](https://github.com/readonlychild/astro-moonwalks)


## Nov/2022

`/publish` `title: ` `[category: ]`

This command has two operation modes:

- Filesystem, where content is saved as `json` files in your computer (where the bot is running)
- S3, where content is saved to an AWS S3 bucket.

### Solution reaction

A thread message is flagged as part of the solution by reaction to it with an emoji named `:solution:`



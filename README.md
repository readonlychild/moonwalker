<div style="background:#1c4479;overflow:auto;margin-bottom:20px;border-radius:10px;color:#fff;">
  <img src="https://cdn.discordapp.com/avatars/937502108645740544/01d6fe55e064c550d84222bcb9b90dc0.png" height="80" style="float:left;" />
  <span style="line-height:80px;font-size:2.2em;">Moonwalker</span>
</div>

This bot is based on this template: [NamVr/DiscordBot-Template](https://github.com/NamVr/DiscordBot-Template#readme) Nov-2022.

# Moonwalker Bot

The easiest way to start using Moonwalker is to use the hosted instance. 

:zap: [Invite Link](https://discord.com/api/oauth2/authorize?client_id=937502108645740544&permissions=431644592192&scope=bot%20applications.commands) | :crystal_ball: Support Server | :eye_speech_bubble: FAQs

## Setting up the hosted version

### What you will need

You will need to select or create a new role that will enable members to publish threads.  The `publish` command will check that the member has this role.

To set the **publishers** role for your server, you will use the following command:

### /settings publish

This command has one required argument "publishers" and two optional arguments, "anonymize" and "unmaskrole".

#### publishers

Here, you need to select the server role that will allow members to publish threads.

#### anonymize

This setting will make it so member usernames and avatars are replaced by fake usernames and avatars.

When set to `No`, published threads will contain your server members' usernames and avatars.

When set to `Yes`, server members's usernames and avatars will be replaced with fake placeholders.

#### unmaskrole

If you pick a role for this setting, any member that belongs to this role means they opt-in to revealing their username and avatar on published threads.

With this setting, you can have your server members opt-in with an auto-role to reveal their identifying information.

## Moonwalker Basics

When using the hosted Moonwalker bot, publishing forum threads will save them to a public S3 location.

To find an online map of your server's published threads, you can build the `url` with the following steps:

- Grab your server id, i.e. `620112554211140000`
- Let's take the first two digits: `62`
- Let's take the next two digits: `01`
- Now let's plug these values in the following `url`

```
https://s3.us-west-2.amazonaws.com/www.readonlychild.com/moonwalks/
<first-two-digits> /
<next-two-digits> /
<server-id> /
_titlemap.json
```

- and we end up with:

`https://s3.us-west-2.amazonaws.com/www.readonlychild.com/moonwalks/62/01/620112554211140000/_titlemap.json`

## astro-moonwalks

There is a sidekick project called [astro-moonwalks](https://github.com/readonlychild/astro-moonwalks) that can generate a webpage per published thread. It uses the above `url` logic based on your server's id.


# Self Hosting

Grab a copy of the master branch:

```
git clone https://github.com/readonlychild/moonwalker.git
cd moonwalker
npm install
```

# Configuration

The main command for the bot is `/publish`.

As of Nov/2022, this command can handle serialization using an S3 Bucket, or the bot's filesystem.

AWS S3 configuration lives in `.env` so that the `aws-sdk` can pick up the credentials  with ease.


# /publish

`/publish` `title: ` `[category: ]`

This command has an optional `title` argument, and an optional `category` argument.

This command has two operation modes:

### Filesystem

Content is saved as `json` files in your computer (where the bot is running)

### S3

Content is saved to an AWS S3 bucket.

## .env

These are the environment variables that can be set in the `.env` file:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
S3_BUCKET=my.bucket.name
S3_KEY_PREFIX=discord/moonwalks
```

### AWS_ACCESS_KEY_ID

The access key value that can write to a folder in an AWS S3 Bucket.

### AWS_SECRET_ACCESS_KEY

The secret value that pairs with the above key.

### S3_BUCKET

The name of the S3 Bucket to publish the JSON thread data.

### AWS_DEFAULT_REGION

AWS Region of the above Bucket.

### S3_KEY_PREFIX

An optional S3 object prefix (folder path) where the JSON files will be published to. Example: `discord/moonwalks`


## config.json

Here are other settings for the bot.

### prefix

Bot prefix, to interacti with the bot with "legacy" commands (precursors to slash commands).

### token

Bot token from the Discord App

### owner

Your discord user id, which the bot will recognize as the owner.

### client_id

Value from the Discord App

### test_guild_id

Id of the server you use for testing.

## publishConfig

The key/values in here are specific to the `/publish` command.

### handler

One of `fsHandler.js` or `s3Handler.js`

Or another custom handler you or someone else has worked on.

## Conventions that were not parameterized as settings

### Solution reaction

A thread message is flagged as part of the solution by reacting to it with an emoji named `:solution:`.

You can create a server emoji and name it `solution`. Any message in a thread that has this emoji in its reactions, will be flagged as `isSolution` in the JSON.



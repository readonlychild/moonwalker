const { SlashCommandBuilder } = require("discord.js");
const { publishPost, fakeUser, embeds } = require('./../../../utils');
const guildSettings = require('./../../../guildSettings.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("publish")
		.setDescription("Send post data to the cloud?.")
    .addStringOption(option => 
      option
        .setName('title')
        .setDescription('Title the thread')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Include a category')
        .setRequired(false)
    ),

	async execute (interaction) {

		let title = interaction.options.getString("title") || '';
		let cat = interaction.options.getString("category") || '';
    let channel = interaction.channel;

    let parentChannel = await interaction.client.channels.fetch(channel.parentId);
    
    if (!parentChannel.availableTags) {
      await interaction.reply({
        embeds: [embeds.warning('This command only works on Guild-Thread type channels')]
      });
      return;
    }

    const settings = await guildSettings.get(interaction.guildId);
    settings.publish = settings.publish || {};

    if (!settings.publish.publishers) {
      await interaction.reply({
        embeds: [embeds.warning('Setting up a **publishers** role is required.')]
      });
      return;
    }

    const member = interaction.member;
    if (!member.roles.cache.has(settings.publish.publishers?.id)) {
      await interaction.reply({
        embeds: [embeds.fail('You do not have the proper role.')]
      });
      return;
    }

    let tagCloud = {};
    parentChannel.availableTags.forEach((tag) => {
      tagCloud[`t${tag.id}`] = JSON.parse(JSON.stringify(tag));
      tagCloud[`t${tag.id}`].count = 0;
    });

    let messages = await channel.messages.fetch({ limit: 100 }) || [];

    let postData = {};
    postData.name = channel.name;
    postData.channelId = channel.id;
    postData.parentId = channel.parentId;
    postData.guildId = channel.guildId;
    postData.guildName = channel.guild.name;
    postData.guildIcon = channel.guild.icon;
    postData.key = `${postData.guildId}/${postData.channelId}`;
    postData.title = title;
    postData.cat = cat;
    postData.messageCount = channel.messageCount;
    postData.memberCount = channel.memberCount;
    postData.tags = [];
    channel.appliedTags.forEach((tag) => {
      if (tagCloud[`t${tag}`]) postData.tags.push(tagCloud[`t${tag}`]);
    });
    postData.messages = [];

    let involvedUsers = {};

    messages.forEach((msg) => {
      if (msg.content) {
        postData.messages.push(getMsgFromMessage(msg, involvedUsers, settings.publish));
      }
    });

    postData.messages.sort((a, b) => {
      if (a.created > b.created) return 1;
      return -1;
    });

    /*await*/ publishPost(postData);

		await interaction.reply({
			embeds: [embeds.success('Published')],
		});
	},
};

function getMsgFromMessage (discordMessage, involvedUsers, settings) {
  let msg = {};
  if (!discordMessage) return false;
  msg.id = discordMessage.id;
  msg.created = discordMessage.createdTimestamp;
  msg.type = discordMessage.type;
  msg.system = discordMessage.system;
  msg.content = discordMessage.content;
  msg.author = {
    id: discordMessage.author.id,
    username: discordMessage.author.username,
    avatar: `https://cdn.discordapp.com/avatars/${discordMessage.author.id}/${discordMessage.author.avatar}.png?size=80`,
    discrim: discordMessage.author.discriminator
  };
  if (settings.anonymize === true) {
    let unmasked = false;
    if (discordMessage.member?.roles.cache.find(r => settings.unmaskRole?.id === r.id)) unmasked = true;
    if (!unmasked) {
      if (!involvedUsers[discordMessage.author.id]) {
        involvedUsers[discordMessage.author.id] = fakeUser();
      }
      msg.author = involvedUsers[discordMessage.author.id];
    }
  }
  if (discordMessage.attachments) {
    discordMessage.attachments.forEach((attach) => {
      msg.attachments = msg.attachments || [];
      msg.attachments.push({
        url: attach.url,
        size: attach.size,
        contentType: attach.contentType
      });
    });
  }
  if (discordMessage.embeds) {
    discordMessage.embeds.forEach((embed) => {
      msg.embeds = msg.embeds || [];
      msg.embeds.push({
        url: embed.url,
        image: embed.image,
        thumbnail: embed.thumbnail
      });
    });
  }
  discordMessage.reactions.cache.forEach((r) => {
    if (r.emoji.name === 'solution') msg.isSolution = true;
  });
  return msg;
};

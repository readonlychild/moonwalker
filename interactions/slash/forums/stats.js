// Deconstructed the constants we need in this file.

const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require("discord.js");
const { config, colors } = require('./../../../utils');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription(
			"Review some post stats."
		)
    .addChannelOption((option) =>
      option
        .setName('forum-channel')
        .addChannelTypes(ChannelType.GuildForum)
        .setDescription('Pick a forum type channel')
        .setRequired(true)
    )
		.addStringOption((option) =>
			option
				.setName("filters")
				.setDescription("Filter[s].")
        .setRequired(false)
		),

	async execute(interaction) {
    let forumChannel = interaction.options.getChannel('forum-channel');
		let filters = interaction.options.getString("filters") || '';

		const embed = new EmbedBuilder().setColor(colors.info);

    embed.setTitle(`Stats`)
      .setDescription(':thumbsup: ' + filters);

    let tagCloud = {};
    forumChannel.availableTags.forEach((tag) => {
      tagCloud[`t${tag.id}`] = JSON.parse(JSON.stringify(tag));
      tagCloud[`t${tag.id}`].count = 0;
    });

    let activePosts = await forumChannel.threads.fetchActive();
    let archivedPosts = await forumChannel.threads.fetchArchived();

    //console.log('active', activePosts);
    //console.log('archived', archivedPosts);

    let stats = {};
    stats.active = 0;
    stats.archived = 0;

    let totalMessageCount = 0;
    let totalMemberCount = 0;

    activePosts.threads.forEach((thread) => {
      stats.active += 1;
      thread.appliedTags.forEach((tag) => {
        if (tagCloud[`t${tag}`]) {
          tagCloud[`t${tag}`].count += 1;
        } else {
          tagCloud['_unknown'] = tagCloud['_unknown'] || { count: 0, name: 'Unknown', id: '_unknown' };
          tagCloud['_unknown'].count += 1;
        }
      });
      totalMessageCount += thread.messageCount;
      totalMemberCount += thread.memberCount;
    });
    archivedPosts.threads.forEach((thread) => {
      stats.archived += 1;
      thread.appliedTags.forEach((tag) => {
        if (tagCloud[`t${tag}`]) {
          tagCloud[`t${tag}`].count += 1;
        } else {
          tagCloud['_unknown'] = tagCloud['_unknown'] || { count: 0, name: 'Unknown', id: '_unknown' };
          tagCloud['_unknown'].count += 1;
        }
      });
      totalMessageCount += thread.messageCount;
      totalMemberCount += thread.memberCount;
    });

    let tagsinfo = '';
    for (prop in tagCloud) {
      tagsinfo += `\n**${tagCloud[prop].name}**: ${tagCloud[prop].count}`;
    }

    stats.totalMemberCount = totalMemberCount;
    stats.totalMessageCount = totalMessageCount;
    console.log('totals', totalMemberCount, totalMessageCount, stats.active, stats.archived);
    stats.avgMembersPerPost = totalMemberCount / (stats.active + stats.archived);
    stats.avgMessagesPerPost = totalMessageCount / (stats.active + stats.archived);

    embed.setDescription(`Active: ${stats.active}, Archived: ${stats.archived}\nTag Cloud: ${tagsinfo}\n**avgMsgs/Post**: ${stats.avgMessagesPerPost.toLocaleString()}\n**avgMembers/Post**: ${stats.avgMembersPerPost.toLocaleString()}`);

		await interaction.reply({
			embeds: [embed],
		});
	},
};

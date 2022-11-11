const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: "bookmark",

	execute(reaction, user) {
		if (reaction._emoji.name === '🔖') {
      let embeds = [];
      let attachments = [];
      let embed = new EmbedBuilder()
        .setColor('#abd')
        .setTitle(':bookmark: Bookmark');
      if (reaction.message.content) {
        embed.setDescription(reaction.message.content + `\n\n[JUMP :arrow_right:](https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id})`);
      } else {
        embed.setDescription(`[JUMP :arrow_right:](https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id})`);
      }
      embeds.push(embed);
      if (reaction.message.embeds) {
        reaction.message.embeds.forEach((em) => {
          embeds.push(em);
        });
      }
      if (reaction.message.attachments) {
        reaction.message.attachments.forEach((att) => {
          attachments.push(att);
        });
      }
      let response = {};
      if (embeds.length) response.embeds = embeds;
      if (attachments.length) response.attachments = attachments;
      user.send(response);
    }
	},
};

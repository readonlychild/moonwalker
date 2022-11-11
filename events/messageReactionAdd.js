const { Collection, ChannelType } = require("discord.js");
const { prefix, owner } = require("../config.json");

module.exports = {
	name: "messageReactionAdd",

	/**
	 * @description Executes when a raection is given on a message.
	 * @author Ernesto Lopez
	 */

	async execute(reaction, user) {
    if (user.bot) return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (reactionFetchEx) {}
    }
    if (!reaction) return;
    
    let client = reaction.client;
    client.reactionHandlers.every((handler) => {
      try {
        handler.execute(reaction, user);
      } catch (ex) {
        console.error(`Error reactionHandler [${handler.name}]`);
        console.error(ex);
      }
    });

	},
};

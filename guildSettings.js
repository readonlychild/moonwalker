const store = require('./store');

const guildSettings = {
  get: async function (guildId) {
    return await store.get(`${guildId}/_settings`);
  },
  save: async function (guildId, settings) {
    return await store.save(`${guildId}/_settings`, settings);
  }
};

module.exports = guildSettings;

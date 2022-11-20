const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildSettings = require('./../../../guildSettings.js');
const { embeds } = require('./../../../utils');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads | PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View settings')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('publish')
        .setDescription('Manage publish settings')
        .addRoleOption(option =>
          option
            .setName('publishers')
            .setDescription('Role for publishers')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('anonymize')
            .setDescription('Anonymize members')
            .setRequired(false)
            .addChoices(
              { name: 'Yes', value: 'yes' },
              { name: 'No', value: 'no' },
            )
        )
        .addRoleOption(option =>
          option
            .setName('unmaskrole')
            .setDescription('Opt-in to reveal username')
            .setRequired(false)
        )
    ),

  async execute (interaction) {

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'view') {
      let settings = await guildSettings.get(interaction.guildId);
      await interaction.reply({
        embeds: [ embeds.info('```json\n' + JSON.stringify(settings, null, 2) + '\n```', 'Settings') ]
      });
    }

    if (subcommand === 'publish') {

      const anonymize = interaction.options.getString('anonymize') || '';
      const publisherRole = interaction.options.getRole('publishers');
      const unmaskRole = interaction.options.getRole('unmaskrole');

      let settings = await guildSettings.get(interaction.guildId);
      settings.publish = settings.publish || {};
      settings.publish.anonymize = anonymize === 'yes' ? true : false;
      settings.publish.publishers = {
        id: publisherRole.id, name: publisherRole.name
      };
      if (unmaskRole) {
        settings.publish.unmaskRole = {
          id: unmaskRole.id, name: unmaskRole.name
        };
      }
      const saved = await guildSettings.save(interaction.guildId, settings);

      if (saved) {
        await interaction.reply({
          embeds: [ embeds.success('Publish settings updated') ]
        });
      } else {
        await interaction.reply({
          embeds: [ embeds.fail('Publish settings could not be saved') ]
        });
      }

    }

  },
};

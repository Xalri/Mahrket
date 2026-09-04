const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the specified channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to unlock.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel') : interaction.channel;

        if (!channel.type === ChannelType.GuildText) {
            return interaction.reply({ content: 'You can only unlock text channels.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: true, // Removing the SEND_MESSAGES overwrite allows messages to be sent again
            });

            await interaction.reply({ content: `Channel ${channel} has been unlocked.`, ephemeral: true });
        } catch (error) {
            console.error('Error unlocking channel:', error);
            await interaction.reply({ content: 'Failed to unlock the channel.', ephemeral: true });
        }
    },
};

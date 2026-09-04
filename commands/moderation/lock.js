const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the specified channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to lock.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel').id : interaction.channel;

        if (!channel.type === ChannelType.GuildText) {
            return interaction.reply({ content: 'You can only lock text channels.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false,
            });

            await interaction.reply({ content: `Channel ${channel} has been locked.`, ephemeral: true });
        } catch (error) {
            console.error('Error locking channel:', error);
            await interaction.reply({ content: 'Failed to lock the channel.', ephemeral: true });
        }
    },
};

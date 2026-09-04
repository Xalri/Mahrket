const { SlashCommandBuilder  } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slow mode for a channel.')
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Slow mode duration in seconds (0 to disable)')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to set slow mode in')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const duration = interaction.options.getInteger('duration');
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        // Check if the user has permission to manage channels
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
        }

        // Check if the bot has permission to manage channels
        if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'I do not have permission to manage channels.', ephemeral: true });
        }

        try {
            // Set slowmode duration
            await channel.setRateLimitPerUser(duration);

            const color = duration === 0?"#00FF00":"#ff9900"

            // Create and send embed
            const slowmodeEmbed = new EmbedBuilder()
                .setColor(color)
                .setTitle('Slow Mode Set')
                .setDescription(`Slow mode has been set to ${duration} seconds in ${channel}.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [slowmodeEmbed] });
        } catch (error) {
            console.error('Error setting slow mode:', error);
            interaction.reply({ content: 'There was an error setting the slow mode. Please try again later.', ephemeral: true });
        }
    },

    info: {channel: "all"}
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a member in the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for unmuting the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!mutedRole) {
            await interaction.reply({ content: 'Muted role not found! Please create a role named "Muted" with appropriate permissions.', ephemeral: true });
            return;
        }

        if (!targetMember.manageable || !targetMember.roles.cache.has(mutedRole.id)) {
            await interaction.reply({ content: 'This member is not muted!', ephemeral: true });
            return;
        }

        await targetMember.roles.remove(mutedRole, reason)
            .then(async () => {
                const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('User Unmuted')
                .setDescription(`${targetMember.user.tag} has been unmuted.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'Reason', value: `${reason}` }
                )
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error unmuting member:', error);
                interaction.reply({ content: 'There was an error trying to unmute this member.', ephemeral: true });
            });
    },
};

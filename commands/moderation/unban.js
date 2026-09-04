const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option =>
            option.setName('target')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for unbanning the user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userId = interaction.options.getString('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.find(ban => ban.user.id === userId);

            if (!bannedUser) {
                await interaction.reply({ content: 'User is not currently banned!', ephemeral: true });
                return;
            }

            await interaction.guild.bans.remove(userId, reason)
                .then(async () => {
                    const embed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('User Unbanned')
                        .setDescription(`${bannedUser.user.tag} has been unbanned.`)
                        .addFields(
                            { name: 'User', value: `${bannedUser.user.tag}`, inline: true },
                            { name: 'Reason', value: `${reason}` }
                        )
                        .setTimestamp();

                        await interaction.reply({ embeds: [embed], ephemeral: true });
                })
                .catch(error => {
                    console.error('Error unbanning user:', error);
                    interaction.reply({ content: 'There was an error trying to unban this user.', ephemeral: true });
                });
        } catch (error) {
            console.error('Error fetching ban list:', error);
            interaction.reply({ content: 'There was an error trying to fetch the ban list.', ephemeral: true });
        }
    },
};

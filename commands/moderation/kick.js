const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), 
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!targetMember.kickable) {
            await interaction.reply({ content: 'I cannot kick this user!', ephemeral: true });
            return;
        }

        await targetMember.kick(reason)
            .then(async () => {
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('User Kicked')
                .setDescription(`${targetMember.user.tag} has been kicked.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'Reason', value: `${reason}` }
                )
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error kicking member:', error);
                interaction.reply({ content: 'There was an error trying to kick this user.', ephemeral: true });
            });
    },
};

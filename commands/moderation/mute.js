const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member in the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for muting the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const mutedRole = interaction.guild.roles.cache.find(r => r.name === "Muted");

        

        if (!targetMember.manageable) {
            await interaction.reply({ content: 'I cannot mute this member!', ephemeral: true });
            return;
        }

        if(targetMember.roles.cache.has(mutedRole.id)){
            await interaction.reply({ content: 'This member is already muted', ephemeral: true });
            return;
        }

        await targetMember.roles.add(mutedRole, reason)
            .then(async () => {
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('User Muted')
                .setDescription(`${targetMember.user.tag} has been muted.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'Reason', value: `${reason}` }
                )
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error muting member:', error);
                interaction.reply({ content: 'There was an error trying to mute this member.', ephemeral: true });
            });
    },
};

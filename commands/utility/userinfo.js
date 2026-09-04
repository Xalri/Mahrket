const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays detailed information about a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            await interaction.reply('User not found in this server.');
            return;
        }

        await interaction.guild.members.fetch(user.id).then(async fetchedMember => {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`User Information - ${user.username}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Username', value: user.username, inline: true },
                    { name: 'ID', value: user.id }
                )
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                });

            if (fetchedMember.presence) {
                embed.addFields({ name: 'Status', value: fetchedMember.presence.status.toUpperCase(), inline: true });
            } else {
                embed.addFields({ name: 'Status', value: 'Offline', inline: true });
            }

            if (member.joinedAt) {
                embed.addFields({ name: 'Joined Server', value: member.joinedAt.toDateString() });
            }

            embed.addFields({ name: 'Joined Discord', value: user.createdAt.toDateString() });

            if (fetchedMember.roles.cache.size > 1) {
                const roles = fetchedMember.roles.cache
                    .filter(role => role.id !== interaction.guild.id)
                    .map(role => role.name)
                    .join(', ');
                embed.addFields({ name: 'Roles', value: roles });
            }

            if (fetchedMember.nickname) {
                embed.addFields({ name: 'Nickname', value: fetchedMember.nickname });
            }

            await interaction.reply({ embeds: [embed] });
        }).catch(error => {
            console.error('Error fetching member:', error);
            interaction.reply('Failed to fetch user information.');
        });
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-unban')
        .setDescription('Unbans all banned users in the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    async execute(interaction) {
        // Check if the user has the BAN_MEMBERS permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Fetch the list of banned users
        const bans = await interaction.guild.bans.fetch();
        if (bans.size === 0) {
            return interaction.reply({ content: 'There are no banned users in this server.', ephemeral: true });
        }

        // Send initial reply
        await interaction.reply({ content: `Starting to unban ${bans.size} user(s).`, ephemeral: true });

        let unbanCount = 0;

        // Unban each user
        for (const [userId, banInfo] of bans) {
            try {
                await interaction.guild.members.unban(userId);
                unbanCount++;
                console.log(`Unbanned ${banInfo.user.tag}`);
            } catch (error) {
                console.error(`Failed to unban ${banInfo.user.tag}: ${error}`);
            }
        }

        // Create an embed for the completion message
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Mass Unban Completed')
            .setDescription(`Successfully unbanned ${unbanCount} user(s).`)
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        // Send the completion embed
        await interaction.followUp({ embeds: [embed] });
    },
};

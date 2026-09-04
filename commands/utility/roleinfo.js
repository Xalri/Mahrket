const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Displays information about a role.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to get information about.')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
            .setTitle('Role Information')
            .setColor(role.color)
            .addFields(
                { name: 'Name', value: role.name},
                { name: 'ID', value: role.id},
                { name: 'Color', value: role.hexColor.toUpperCase()},
                { name: 'Members', value: role.members.size.toString()},
                { name: 'Position', value: role.position.toString()},
                { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No'},
                { name: 'Managed', value: role.managed ? 'Yes' : 'No'},
                { name: 'Created At', value: role.createdAt.toLocaleDateString()}
            )
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();
            

        await interaction.reply({ embeds: [embed]});
    },
};
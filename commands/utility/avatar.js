const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the avatar of a user.')
        .addUserOption(option => option.setName('target').setDescription('The user whose avatar you want to see')),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(avatarURL)
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

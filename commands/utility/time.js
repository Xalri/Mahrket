const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('return the current time'),
	async execute(interaction) {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
		const embed = new EmbedBuilder()
			.setColor(`${randomColor}`)
            .setTitle(`Current time`)
            .setDescription(`The time is ${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}`)
			.setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
	},
};
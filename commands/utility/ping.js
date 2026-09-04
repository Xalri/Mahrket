const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
		const embed = new EmbedBuilder()
			.setColor(`${randomColor}`)
			.setTitle(`Bot & API ping`)
			.setFields(
				{name: "Bot", value: `The bot ping is ${Date.now() - interaction.createdTimestamp} ms`},
				{name: "API", value:`The API ping is ${Math.round(interaction.client.ws.ping)} ms`}
			)
			.setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
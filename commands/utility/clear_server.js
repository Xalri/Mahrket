const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear_server')
		.setDescription('clears the entire server'),
	async execute(interaction) {
        interaction.guild.channels.fetch().then(channels => channels.forEach(channel => channel.delete()))
	},
};
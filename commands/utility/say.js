const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('make the bot says what you want')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to say')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.reply({content:"message sent", ephemeral: true})
		await interaction.channel.send(interaction.options.getString('message'))
	},
};
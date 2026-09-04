const { SlashCommandBuilder } = require('discord.js');
const Guilds = require('../../Schemas/discord-bot-schema')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-schema')
		.setDescription('Testing a schema'),
	async execute(interaction) {
		const data = await Guilds.find()

        await data.forEach(async d =>{
            await Guilds.deleteOne({name: d.name})
            await Guilds.deleteOne({id: d.id})
        })
        await interaction.reply({content: `all values deleted`})
	},
};
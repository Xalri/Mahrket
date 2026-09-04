const { SlashCommandBuilder } = require('discord.js');
const { Guilds, Channels } = require('../../Schemas/discord-bot-schema')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read-schema')
		.setDescription('Testing a schema'),
	async execute(interaction) {
		const data = await Guilds.find()

        var value = []
        await data.forEach(async d =>{
            value.push([d.name, d.id])
        })
        await interaction.reply({content: `${value.join('\n')}`})

		const data2 = await Channels.find()

        var value2 = []
        await data2.forEach(async d =>{
            value2.push([d.guild_id, d.cchannel, d.gechannel, d.gochannel, d.wechannel, "\n"])
        })
        await interaction.followUp({content: `${value2.join('\n')}`})
	},
};
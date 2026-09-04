const { SlashCommandBuilder } = require('discord.js');
const Guilds = require('../../Schemas/discord-bot-schema')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test-schema')
		.setDescription('Testing a schema')
        .addStringOption(option =>
            option.setName("schema-input")
                .setDescription("text to save")
                .setRequired(true)
        ),
	async execute(interaction) {
		const string = interaction.options.getString('schema-input')
        try{
            await Guilds.create({
                id: Math.floor(Math.random() * choices.length),
                name: string
            });
        } catch(err){
            console.log("ERROR WHILE CREATING DATA" + err)
        }

        await interaction.reply("data saved")
	},
};
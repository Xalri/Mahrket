const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const superagent = require('superagent')
const { onlyEmoji } = require('emoji-aware')
const config = require('../../config');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emoji-mixer')
		.setDescription('Mix two emoji together')
        .addStringOption(option => 
            option.setName('emojis')
            .setDescription('The emojis to mix')
            .setRequired(true)
        ).addStringOption(option => 
            option.setName('name')
            .setDescription('The name to give to the new emoji')
            .setRequired(true)
        ),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
        const {options} = interaction
        const eString = options.getString('emojis')
        const name = options.getString('name')
        const input = onlyEmoji(eString)
        const response = `⚠️ One or both of these emojis \`${eString}\` are not supported. Keep in mind that gesture (ie. Thumb Up) and custom server emojis are not supported.`

        const output = await superagent.get('https://tenor.googleapis.com/v2/featured')
        .query({
            key: config.tenorApiKey,
            contentFilter: "high",
            media_filter: "png_transparent",
            component: "proactive",
            collection: "emoji_kitchen_v5",
            q: input.join('_')
        }).catch(err => {})



        if (!output){
            return await interaction.editReply({content: response, ephemeral: true})
        }else if(!output.body.results[0]){
            return await interaction.editReply({content: response, ephemeral: true})
        }else if(eString.startsWith("<") || eString.endsWith('>')){
            return await interaction.editReply({content: response, ephemeral: true})
        }

        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setImage(output.body.results[0].url)

        await interaction.guild.emojis.create({attachment: output.body.results[0].url, name: String(name)})
        await interaction.editReply({embeds: [embed]})


	},
};
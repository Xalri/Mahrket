const { OpenAI } = require("openai")
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');


const openai = new OpenAI({
    apiKey: config.openaiApiKey
})




module.exports = {
	data: new SlashCommandBuilder()
		.setName('ai')
		.setDescription('Test the ai')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The text to send to chatGPT')
                .setRequired(false)),
	async execute(interaction) {
		// let prompt = `The following is a conversation between ${users.join(", ")}, and ${lastUser}. \n\n`
        let prompt = `The following is a conversation between Xalri, and Koro. \n\n`

        const message = interaction.options.getString('prompt') ? interaction.options.getString('prompt') : "Say this is a test";


        // for (let i = messages.length - 1; i >= 0; i--) {
        //     const m = messages[i]
        //     prompt += `${m.member.displayName}: ${m.content}\n`
        // }

        prompt += "xalri: hello\n"
        prompt += "koro: hello xalri\n"
        prompt += "xalri: nice to meet you\n"
        prompt += "koro: nice to meet you too\n"

        // prompt += `${client.user.username}:`
        prompt += `xalri: how are you`
        console.log("prompt:", prompt)

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {role:'system', content: 'you are an assistant in a discord server, you try to help everyone who needs help'},
                { role: 'user', content: message }
            ],
            model: 'gpt-3.5-turbo',
            max_tokens: 50
        }).catch((err) => console.error("OpenAI Error " + err))

        console.log(chatCompletion.choices[0].message.content)
        interaction.reply(chatCompletion.choices[0].message.content)
    
	}
};
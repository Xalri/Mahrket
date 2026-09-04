const { SlashCommandBuilder } = require('@discordjs/builders');
const {  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll-open')
        .setDescription('Create a poll for users to submit their own answers')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the poll in minutes (default: 5)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const duration = interaction.options.getInteger('duration') || 5; // Default duration in minutes

        // Create a message action row with an input box
        const embed = new EmbedBuilder()
                .setTitle("New open poll")
                .setDescription(` Poll: ${question}`)
                .setColor('#0099ff')


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('answer')
                .setStyle(ButtonStyle.Success)
                .setCustomId('poll')
            )
        interaction.reply({
            embeds: [embed],
            components: [row]
        })

        // Set timeout to end the poll after specified duration
        setTimeout(async () => {

            let resultsEmbed;

            if(global.pollAnswers.lentgh === 0){
                resultsEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Poll Results')
                .setDescription(`Question: ${question}`)
                .addFields({name: "Poll cancelled", value:"\`reason\`: No answer"})
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();
            }

            resultsEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Poll Results')
                .setDescription(`Question: ${question}`)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            global.pollAnswers.forEach(async (answer) => {
                resultsEmbed.addFields({name: answer.author, value: answer.answer})
            })

            global.pollAnswers = []

            await interaction.editReply({ embeds: [resultsEmbed] });

        }, duration * 60 * 1000); // Convert minutes to milliseconds
    },
};

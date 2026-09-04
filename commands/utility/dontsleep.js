const cron = require("node-cron");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


let cronJob = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dontsleep')
		.setDescription('don\'t let the bot sleep'),
	async execute(interaction) {

        if(cronJob.has("dontsleep")){
            cronJob.get("dontsleep").stop();
            cronJob.delete("dontsleep");
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(`Coffey stopped`)
                .setFields({name: " ", value: `Coffey stopped at ${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}`})
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }else{
            const newJob = cron.schedule('0 10-21 * * *', function() {
                interaction.client.user.setStatus('online')
            });
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`Coffey served`)
                .setFields({name: " ", value: `Coffey served at ${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}`})
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            cronJob.set("dontsleep", newJob)
        }
	},
};
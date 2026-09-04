const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cron = require("node-cron");
const { randchoice } = require('../../utils.js')

const cronJob = new Map();
let isRunning = false

module.exports = {
	data: new SlashCommandBuilder()
		.setName('revision')
		.setDescription('start revision question')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of text')
                .setRequired(true)
        
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ping')
        ),
	async execute(interaction) {
        if(!cronJob.has((interaction.options.getUser('user') !== null ? interaction.options.getUser('user').id : interaction.user.id))){

            var user = interaction.options.getUser('user') || "<@" + interaction.user.id + ">";
            var username = interaction.options.getUser('user')? interaction.options.getUser('user').tag : interaction.user.tag

            const embed2 = new EmbedBuilder()
                .setColor(`#00FF00`)
                .setTitle(`Studying started`)
                .setDescription(`Studying started at ${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})} for ${user}`)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed2] });

            channel = interaction.channel

            
            const newJob = cron.schedule('0 10-21 * * *', async function() {
                console.log("cron task executed at " + new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"}) + " for user " + username)
                let liste = []
                for (let step = 0; step < interaction.options.getInteger('number'); step++){
                    liste.push("Texte " + (step + 1))
                }
                text = randchoice(liste)
                const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
                const embed = new EmbedBuilder()
                    .setColor(`${randomColor}`)
                    .setTitle(`Time to study`)
                    .setDescription(`Hey ${user}, your text is ${Math.floor(Math.random() * interaction.options.getInteger('number')).toString()}`)
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            });

            cronJob.set((interaction.options.getUser('user') !== null ? interaction.options.getUser('user').id : interaction.user.id), newJob)

            
            let liste = []

            console.log("cron task executed at " + new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"}) + " for user " + username)
            for (let step = 0; step < interaction.options.getInteger('number'); step++){
                liste.push("Texte " + (step + 1))
            }
            text = randchoice(liste)
            const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
            const embed = new EmbedBuilder()
                .setColor(`${randomColor}`)
                .setTitle(`Time to study`)
                .setDescription(`Hey ${user}, your text is ${Math.floor(Math.random() * interaction.options.getInteger('number')).toString()}`)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } else{
            var user = interaction.options.getUser('user') || "<@" + interaction.user.id + ">";
            const embed = new EmbedBuilder()
                .setColor(`#ff0000`)
                .setTitle(`Studying stopped`)
                .setDescription(`Studying stopped at ${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})} for ${user}`)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            cronJob.get((interaction.options.getUser('user') !== null ? interaction.options.getUser('user').id : interaction.user.id)).stop();
            cronJob.delete((interaction.options.getUser('user') !== null ? interaction.options.getUser('user').id : interaction.user.id));
        }
	},
};





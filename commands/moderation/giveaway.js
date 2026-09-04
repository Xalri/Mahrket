const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Manage giveaways')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new giveaway')
                .addStringOption(option => option.setName('prize').setDescription('The prize for the giveaway').setRequired(true))
                .addIntegerOption(option => option.setName('duration').setDescription('Duration of the giveaway in minutes').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End an ongoing giveaway')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll an ongoing giveaway')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'start') {
            const prize = interaction.options.getString('prize');
            const duration = interaction.options.getInteger('duration');

            const embed = new EmbedBuilder()
                .setTitle('🎉 Giveaway! 🎉')
                .setDescription(`**Prize:** ${prize}\nReact with 🎉 to enter!`)
                .setColor('#00FF00')
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            const giveawayMessage = await interaction.channel.send({ embeds: [embed], fetchReply: true });
            await interaction.reply({content: "Giveaway started!", ephemeral: true})
            await giveawayMessage.react('🎉');

            var timeoutID = setTimeout(async () => {
                const users = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
                const filteredUsers = users.filter(user => !user.bot);

                if (filteredUsers.size === 0) {
                    return interaction.followUp('No valid entries, giveaway cancelled.');
                }

                const winner = filteredUsers.random();

                const winnerEmbed = new EmbedBuilder()
                    .setTitle('🎉 Giveaway Ended! 🎉')
                    .setDescription(`**Prize:** ${prize}\n**Winner:** <@${winner.id}>`)
                    .setColor('#00FF00')
                    .setFooter({ 
                        text: `Requested by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();

                await giveawayMessage.edit({ embeds: [winnerEmbed] });
                await interaction.followUp(`Congratulations <@${winner.id}>! You won **${prize}**!`);
            }, duration * 60 * 1000);

        } else if (subcommand === 'end') {
            let fetchedGwMessages = await interaction.channel.messages.fetch()
            const temp = fetchedGwMessages.filter(
                message => message.author.id === interaction.client.user.id && message.embeds
            )
            const gwMessage = temp.filter(message => {
                if (message.embeds.length > 0 && message.embeds[0].title === '🎉 Giveaway! 🎉') {
                    return true;
                }
                return false;
            }).first();

            


            if (!gwMessage) {
                return interaction.reply({ content: 'Could not find the giveaway message.', ephemeral: true });
            }

            const users = await gwMessage.reactions.cache.get('🎉').users.fetch();
            const filteredUsers = users.filter(user => !user.bot);
            if (filteredUsers.size === 0) {
                return interaction.followUp('No valid entries, giveaway cancelled.');
            }

            

            

            const winner = filteredUsers.random();

            const prize = gwMessage.embeds[0].description.split('\n')[0].replace('**Prize:** ', '');

            const winnerEmbed = new EmbedBuilder()
                .setTitle('🎉 Giveaway Ended! 🎉')
                .setDescription(`**Prize:** ${prize}\n**Winner:** <@${winner.id}>`)
                .setColor('#00FF00')
                .setTimestamp();

            await gwMessage.edit({ embeds: [winnerEmbed] });
            await interaction.channel.send(`Congratulations <@${winner.id}>! You won **${prize}**!`);
            await interaction.reply({content: "Giveaway ended!", ephemeral: true});
            clearTimeout(timeoutID)



        } else if (subcommand === 'reroll') {
            let fetchedGwMessages2 = await interaction.channel.messages.fetch()
            const temp2 = fetchedGwMessages2.filter(
                message => message.author.id === interaction.client.user.id && message.embeds
            )
            const gwMessage2 = temp2.filter(message => {
                if (message.embeds.length > 0) {
                    if(message.embeds[0].title === '🎉 Giveaway Ended! 🎉'){
                        return true;
                    }
                }
                return false;
            }).first();

            if (!gwMessage2) {
                return interaction.reply({ content: 'Could not find the giveaway message.', ephemeral: true });
            }


            const users2 = await gwMessage2.reactions.cache.get('🎉').users.fetch();
            const filteredUsers2 = users2.filter(user => !user.bot);
            if (filteredUsers2.size === 0) {
                return interaction.followUp('No valid entries, giveaway cancelled.');
            }




            let chosenUser2 = []
            const fetchedMessages  = await interaction.channel.messages.fetch()
            const winMessages = fetchedMessages.filter(
                message => message.author.id === interaction.guild.members.me.id && message.content.startsWith("Congratulations")
            );
            
            winMessages.forEach(async (message) => {
                if(message.mentions.users.first()){
                    chosenUser2.push(message.mentions.users.first().id)
                }
            })
            console.log(chosenUser2)

            let newFilter = filteredUsers2.filter(
                user =>!chosenUser2.includes(user.id)
            )
            console.log(newFilter)

            if(newFilter.size === 0){
                interaction.reply({content: "all users have been chosen 1 times, reseting the list", ephemeral: true})
                winMessages.forEach(async (message) => {
                    message.delete()
                })

                newFilter = filteredUsers2
                console.log(newFilter)
            }


            

            const winner = newFilter.random();

            const prize = gwMessage2.embeds[0].description.split('\n')[0].replace('**Prize:** ', '');

            const winnerEmbed = new EmbedBuilder()
                .setTitle('🎉 Giveaway Ended! 🎉')
                .setDescription(`**Prize:** ${prize}\n**Winner:** <@${winner.id}>`)
                .setColor('#00FF00')
                .setTimestamp();

            await gwMessage2.edit({ embeds: [winnerEmbed] });
            await interaction.channel.send(`Congratulations <@${winner.id}>! You won **${prize}**!`);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: "Giveaway ended!", ephemeral: true});
            } else {
                await interaction.reply({content: "Giveaway ended!", ephemeral: true});
            }

        }
    }
};

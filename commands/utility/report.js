const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Channels } = require('../../Schemas/discord-bot-schema')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user, message, or a bug.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Report a user.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to report')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for the report')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Report a message.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel containing the message')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('ID of the message to report or if not possible, the message content')
                        .setRequired(true))
                .addUserOption(option =>
                    option.setName('author')
                        .setDescription('the author of the message')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for the report')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('bug')
                .setDescription('Report a bug.')
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Description of the bug')
                        .setRequired(true))),

    async execute(interaction) {
        const { options } = interaction;

        try {
            // Check if the guild exists in the database
            var Guild = await Channels.findOne({ guild_id: interaction.guild.id });
            
            // If the guild doesn't exist in the database, register it
            if (!Guild) {
                Guild = Channels.create({
                guild_id: interaction.guild.id
            });
                // await Guild.save();
                console.log(`Registered new guild: ${interaction.guild.name} (${interaction.guild.id})`);
            }
        } catch (err) {
            console.error('Error checking or registering guild:', err);
        }

        if(Guild.rechannel === ""){
            return await interaction.reply({content: "The owner didn't setup the report system", ephemeral: true})
        }

        report_channel = await interaction.client.channels.fetch(Guild.rechannel)

        if (options.getSubcommand() === 'user') {
            const reportedUser = options.getUser('user');
            const reason = options.getString('reason');

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('User Report')
                .setDescription(`User reported: ${reportedUser}`)
                .addFields({name:'Reported by', value: interaction.user.toString()})
                .addFields({name: 'Reason', value: reason})
                .setTimestamp();


            const sentMessage = await report_channel.send({ embeds: [embed] })
                .catch(error => {
                    console.error('Error sending user report:', error);
                    interaction.reply({ content: 'Sorry, there was an error while sending your user report.', ephemeral: true });
                });
            await interaction.reply({ content: 'User report sent! Thank you for your report.', ephemeral: true })
            await sentMessage.react('✅')
            
        } else if (options.getSubcommand() === 'message') {
            const channel = options.getChannel('channel');
            const messageId = options.getString('message_id');
            const reason = options.getString('reason');
            const author = options.getUser('author');

            try {
                let message;
                if((/[a-zA-Z]/.test(messageId))){
                    message = messageId
                }else{
                    message = await channel.messages.fetch(messageId);
                }

                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Message Report')
                    .setDescription(`Message reported in ${channel}`)
                    .addFields({name: 'Reported by', value: interaction.user.toString()})
                    .addFields({name: "Message author", value: author.username})
                    .addFields({name: 'Reason', value: reason})
                    .setTimestamp();


                if((/[a-zA-Z]/.test(messageId))){
                    embed.addFields({name: 'Message', value: message})
                }else{
                    embed.addFields({name: 'Message', value: message.content})
                }

                const sentMessage = await report_channel.send({ embeds: [embed] })
                    .catch(error => {
                        console.error('Error sending message report:', error);
                        return interaction.reply({ content: 'Sorry, there was an error while sending your message report.', ephemeral: true });
                    });
                    
                await sentMessage.react('✅')
                    
                await interaction.reply({ content: 'Message report sent! Thank you for your report.', ephemeral: true })

                
            } catch (error) {
                console.error('Error fetching message:', error);
                interaction.reply({ content: 'Sorry, there was an error while fetching the message.', ephemeral: true });
            }
        } else if (options.getSubcommand() === 'bug') {
            const bugDescription = options.getString('description');

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Bug Report')
                .setDescription(`Bug reported by ${interaction.user}`)
                .addFields({name: 'Description', value: bugDescription})
                .setTimestamp();


            const sentMessage = await report_channel.send({ embeds: [embed] })
                .catch(error => {
                    console.error('Error sending bug report:', error);
                    return interaction.reply({ content: 'Sorry, there was an error while sending your bug report.', ephemeral: true });
                });
            interaction.reply({ content: 'Bug report sent! Thank you for your feedback.', ephemeral: true })
                

            await sentMessage.react('✅')
        }
    },
};

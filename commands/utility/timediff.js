const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timediff')
        .setDescription('Calculates the time difference between two messages or one message and the current time.')
        .addStringOption(option => 
            option.setName('message_id_1')
                .setDescription('The ID of the first message')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('message_id_2')
                .setDescription('The ID of the second message (optional)')
                .setRequired(false)),
    async execute(interaction) {
        const messageId1 = interaction.options.getString('message_id_1');
        const messageId2 = interaction.options.getString('message_id_2');
        const replyMessage = interaction.reference ? await interaction.channel.messages.fetch(interaction.reference.messageId) : null;

        try {
            let message1, message2;

            // Handle cases based on inputs
            if (replyMessage && messageId1 && !messageId2) {
                // If there's a reply and one message ID is provided
                message1 = replyMessage;
                message2 = await interaction.channel.messages.fetch(messageId1);
            } else if (messageId1 && messageId2) {
                // If two message IDs are provided
                message1 = await interaction.channel.messages.fetch(messageId1);
                message2 = await interaction.channel.messages.fetch(messageId2);
            } else if (replyMessage && !messageId1 && !messageId2) {
                // If only replying to a message
                message1 = replyMessage;
                message2 = { createdTimestamp: Date.now() };
            } else if (messageId1 && !messageId2 && !replyMessage) {
                // If only one message ID is provided
                message1 = await interaction.channel.messages.fetch(messageId1);
                message2 = { createdTimestamp: Date.now() };
            } else {
                return interaction.reply({ content: 'You must provide either a reply or one/two message IDs.', ephemeral: true });
            }

            // Calculate time difference
            const timeDiff = Math.abs(message1.createdTimestamp - message2.createdTimestamp);

            const seconds = Math.floor((timeDiff / 1000) % 60);
            const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
            const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            // Create and send embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Time Difference')
                .setDescription('Time difference calculated:')
                .addFields(
                    { name: 'Days', value: `${days}`, inline: true },
                    { name: 'Hours', value: `${hours}`, inline: true },
                    { name: 'Minutes', value: `${minutes}`, inline: true },
                    { name: 'Seconds', value: `${seconds}`, inline: true },
                );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error fetching the messages. Please check the message IDs.', ephemeral: true });
        }
    },
};

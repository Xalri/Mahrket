const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, WebhookClient, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imitate')
        .setDescription('Sends a fake message imitating another user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to imitate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // Fetch the user and message content from the options
        const targetUser = interaction.options.getUser('user');
        const messageContent = interaction.options.getString('message');

        // Create a webhook in the current channel
        try {
            const webhook = await interaction.channel.createWebhook(targetUser.username, {
                avatar: targetUser.displayAvatarURL({ format: 'png' }),
            });

            // Send the message through the webhook
            await webhook.send(messageContent);

            // Delete the webhook after sending the message
            await webhook.delete();

            // Reply to the interaction indicating success
            await interaction.reply({ content: 'Message sent successfully!', ephemeral: true });
        } catch (error) {
            console.error('Error creating or using webhook:', error);
            await interaction.reply({ content: 'Failed to send the message.', ephemeral: true });
        }
    },
};

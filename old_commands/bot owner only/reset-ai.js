const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../Schemas/discord-bot-schema');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-ai')
        .setDescription('reset daily ai tokens for a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to reset tokens for').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('target');

        if (!targetUser) {
            return interaction.reply({ content: 'Please specify a valid user.', ephemeral: true });
        }

        try {
            const userData = await Users.findOne({ guildId: interaction.guild.id, userId: targetUser.id });

            if (!userData) {
                return interaction.reply({ content: 'User not found in the database.', ephemeral: true });
            }

            // Clear warnings
            userData.ai = 5;
            await userData.save();

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`Daily token reset`)
                .setDescription(`Daily ai token reset for ${targetUser.tag}.`)
                .setTimestamp();

            interaction.reply({ embeds: [embed]});
        } catch (error) {
            console.error('Error reseting daily token:', error);
            interaction.reply({ content: 'An error occurred while reseting daily token.', ephemeral: true });
        }
    },
};

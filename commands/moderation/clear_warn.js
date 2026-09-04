const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../Schemas/discord-bot-schema');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_warn')
        .setDescription('Clear warnings for a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to clear warnings for').setRequired(true)),
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
            userData.warnings = 0;
            await userData.save();

            const embed = new EmbedBuilder()
                .setColor('#008000')
                .setTitle(`Warnings clear`)
                .setDescription(`Warnings cleared for ${targetUser.tag}.`)
                .setTimestamp();

            interaction.reply({ embeds: [embed]});
        } catch (error) {
            console.error('Error clearing warnings:', error);
            interaction.reply({ content: 'An error occurred while clearing warnings.', ephemeral: true });
        }
    },
};

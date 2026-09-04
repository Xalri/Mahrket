const { SlashCommandBuilder } = require('@discordjs/builders');
const { Counting } = require('../../Schemas/discord-bot-schema');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-counting')
        .setDescription('reset counting in this server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }



        try {
            const counting = await Counting.findOne({ Guild: interaction.guild.id});

            if (!counting) {
                return interaction.reply({ content: 'Counting not found in the database.', ephemeral: true });
            }

            // Clear warnings
            counting.Number = 1;
            await counting.save();

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`Counting reset`)
                .setDescription(`Number for counting reset.`)
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true});
        } catch (error) {
            console.error('Error reseting counting:', error);
            interaction.reply({ content: 'An error occurred while reseting counting.', ephemeral: true });
        }
    },
};

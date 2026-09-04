const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a specified number of messages.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'You can only delete between 1 and 100 messages.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true)
            .then(async messages => {
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Messages purged')
                .setDescription(`${messages.size} has been purged.`)
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch(error => {
                console.error('Error purging messages:', error);
                interaction.reply({ content: 'There was an error trying to purge messages.', ephemeral: true });
            });
    },

    info: {channel: "all"}
};

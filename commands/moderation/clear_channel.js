const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear_channel')
        .setDescription('Clear all messages in the channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const channel = interaction.channel;

        await interaction.deferReply({ ephemeral: true  });

        async function deleteMessages() {
            try {
                const fetched = await channel.messages.fetch({ limit: 100 });
                if (fetched.size === 0) return;

                await channel.bulkDelete(fetched, true);
                await deleteMessages();
            } catch (error) {
                console.error('Error clearing channel:', error);
                interaction.followUp({ content: 'There was an error trying to clear the channel.', ephemeral: true });
            }
        }

        await deleteMessages()
            .then(() => {
                interaction.followUp({ content: 'Channel cleared.', ephemeral: true });
            })
            .catch(error => {
                console.error('Error clearing channel:', error);
                interaction.followUp({ content: 'There was an error trying to clear the channel.', ephemeral: true });
            });
    },

    info: {channel: "all"}
};

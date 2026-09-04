const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Users } = require('../../Schemas/discord-bot-schema'); // Adjust the path as necessary

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-reminder')
        .setDescription('Cancel a reminder.'),
    async execute(interaction) {
        const user = interaction.user;
        const userData = await Users.findOne({ userId: user.id, guildId: interaction.guild.id });

        if (!userData || userData.reminders.length === 0) {
            return interaction.reply({ content: 'You have no active reminders.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Cancel a Reminder')
            .setDescription('Select a reminder to cancel by clicking the corresponding button.')
            .setTimestamp()
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            });

        const rows = userData.reminders.map((reminder, index) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`cancel_reminder_${index}`)
                        .setLabel(`Cancel Reminder ${index + 1}`)
                        .setStyle(ButtonStyle.Danger)
                );
            return row;
        });

        await interaction.reply({ embeds: [embed], components: rows, ephemeral: true });

        const filter = i => i.customId.startsWith('cancel_reminder_') && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const index = parseInt(i.customId.split('_').pop(), 10);
            const reminderId = userData.reminders[index].id;

            // Remove reminder from database
            userData.reminders.splice(index, 1);
            await userData.save();


            // Stop the timeout and remove from the map
            if (reminderTasks.has(reminderId)) {
                clearTimeout(reminderTasks.get(reminderId));
                reminderTasks.delete(reminderId);
            }

            await i.update({ content: `Reminder ${index + 1} has been cancelled.`, components: [], ephemeral: true });
            collector.stop();
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await interaction.followUp({ content: 'You did not select a reminder in time to cancel.', ephemeral: true });
            }
        });
    },
};

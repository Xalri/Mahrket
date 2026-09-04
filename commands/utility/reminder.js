const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const cron = require('node-cron');
const { Users } = require('../../Schemas/discord-bot-schema'); // Ensure this schema tracks reminders
const creatorTag = 'yourCreatorTag#1234'; // Replace with your actual tag

global.reminderTasks = new Map(); // Store cron tasks

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a reminder.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time after which to send the reminder (e.g., 10s, 5m, 2h)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The reminder message')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const message = interaction.options.getString('message');
        const user = interaction.user;
        const member = interaction.member;

        // Get user's role and check reminder limits
        const userRoles = member.roles.cache;
        const isModerator = userRoles.some(role => role.name === 'Moderator');
        const isOwner = userRoles.some(role => role.name === 'Owner');
        const isCreator = user.tag === creatorTag;

        let maxReminders = 1; // Default for regular users
        if (isModerator) maxReminders = 3;
        if (isOwner || isCreator) maxReminders = Infinity;

        // Fetch user's reminders from the database
        let userData = await Users.findOne({ userId: user.id, guildId: interaction.guild.id });
        if (!userData) {
            userData = new Users({
                userId: user.id,
                guildId: interaction.guild.id,
                reminders: []
            });
        }

        if (userData.reminders.length >= maxReminders) {
            return interaction.reply({ content: `You can only have ${maxReminders} active reminder(s).`, ephemeral: true });
        }

        // Parse the time string to milliseconds
        const timeRegex = /^(\d+)(s|m|h|d)$/;
        const matches = time.match(timeRegex);
        if (!matches) {
            return interaction.reply({ content: 'Invalid time format. Use s (seconds), m (minutes), h (hours), or d (days).', ephemeral: true });
        }

        const value = parseInt(matches[1], 10);
        const unit = matches[2];

        let delay;
        switch (unit) {
            case 's':
                delay = value * 1000;
                break;
            case 'm':
                delay = value * 60 * 1000;
                break;
            case 'h':
                delay = value * 60 * 60 * 1000;
                break;
            case 'd':
                delay = value * 24 * 60 * 60 * 1000;
                break;
        }

        // Schedule the reminder
        const reminderId = `${user.id}-${Date.now()}`;
        const task = setTimeout(async () => {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Reminder')
                .setDescription(message)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            try {
                await user.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error sending reminder:', error);
            }

            // Remove the task from the map and the database
            reminderTasks.delete(reminderId);
            userData.reminders = userData.reminders.filter(reminder => reminder.id !== reminderId);
            await userData.save();
        }, delay);

        // Register the task
        reminderTasks.set(reminderId, task);

        // Save the reminder to the database
        userData.reminders.push({ id: reminderId, time, message });
        await userData.save();

        await interaction.reply({ content: `Reminder set for ${time}. I'll remind you : ${message}`, ephemeral: true });
    },
};

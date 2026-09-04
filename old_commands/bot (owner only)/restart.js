const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts the bot (Admin only)'),
    async execute(interaction) {
        // Check if the user has the admin role (adjust role ID or name as needed)
        
        if (!interaction.member.user.tag === "xalri") {
            return interaction.reply('You do not have permission to use this command.' + interaction.member.user.tag);
        }

        // Confirm the restart request
        await interaction.reply('Restarting bot...');

        // Execute the PM2 restart command
        exec('pm2 restart discord-bot', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return interaction.followUp(`Error: ${error.message}`);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return interaction.followUp(`Error: ${stderr}`);
            }
            interaction.followUp(`Bot restarted successfully. Output: ${stdout}`);
        });
    },
};

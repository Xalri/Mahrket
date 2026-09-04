const { SlashCommandBuilder, Permissions } = require('discord.js');
const { exec } = require('child_process');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('execute')
        .setDescription('execute a command on the bot host server.')
        .addStringOption(option =>
            option.setName('cmd')
                .setDescription('The command to execute')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();
        const command = interaction.options.getString('cmd');
        exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing command: ${error.message}`);
              interaction.editReply(`Error executing command: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Command stderr: ${stderr}`);
              interaction.editReply(`Command stderr: ${stderr}`);
              return;
            }
            console.log(`Command output: ${stdout}`);
            interaction.editReply(`Command output:\n\`\`\`\n${stdout}\n\`\`\``);
          });
    },
};

const { SlashCommandBuilder, Permissions } = require('discord.js');
const { exec } = require('child_process');
const deploy_commands = require("../../deploy_commands.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('execute')
        .setDescription('execute a command on the bot host server.')
        .addStringOption(option =>
            option.setName('cmd')
                .setDescription('The command to execute')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({ephemeral: true});
        const command = interaction.options.getString('cmd');
        if(command === "deploy"){
            deploy_commands()
            return interaction.editReply({content: "command deployed", ephemeral: true})
        }
        exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing command: ${error.message}`);
              interaction.editReply({content: `Error executing command: ${error.message}`, ephemeral: true});
              return;
            }
            if (stderr) {
              console.error(`Command stderr: ${stderr}`);
              interaction.editReply({content: `Command stderr: ${stderr}`, ephemeral: true});
              return;
            }
            console.log(`Command output: ${stdout}`);
            interaction.editReply({content: `Command output:\n\`\`\`\n${stdout}\n\`\`\``, ephemeral: true});
          });
    },
};

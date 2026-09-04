const path = require('node:path');
const config = require("../config")
const fs = require('node:fs');

function load_commands(bot ){
    const foldersPath = path.join(path.join(__dirname, "../"), 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    // const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                bot.commands.set(command.data.name, command);
                console.log(`Command ${command.data.name} added to bot`);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    console.log(" ")
}

module.exports = load_commands;
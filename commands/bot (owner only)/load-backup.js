const fs = require('fs').promises;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('load-backup')
        .setDescription('Load a backup into the server.')
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('The backup file to load.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // Check permissions
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                return await interaction.reply({
                    content: 'You must have administrator permissions to use this command.',
                    ephemeral: true
                });
            }

            // Retrieve the backup file attachment
            const backupFile = interaction.options.getAttachment('file');

            const input = {
                method: "GET",
                url: backupFile.url,
                
            }

            console.log("input : " + JSON.stringify(input))

            const output = axios.get(input)
                .then(function (response) {
                    console.log("REPONSE : " + response.data)
                })

            // console.log(output)

            console.log("OPTION : " + JSON.stringify(backupFile))

            // Read the backup file from disk
            // const backupData = await fs.readFile(backupFile, 'utf-8');
            // const parsedBackup = backupFile.toJSON();

            

            

            // console.log(parsedBackup)

            // Apply backup data to the server
            // await applyBackupData(interaction.guild, parsedBackup);

            // Confirmation embed
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Server Backup Loaded')
                .setDescription('The server configuration has been successfully loaded from backup.')
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error loading backup:', error);
            await interaction.reply({ content: 'Failed to load backup.', ephemeral: true });
        }
    },
};

async function applyBackupData(guild, backupData) {
    // Apply roles
    for (const roleData of backupData.roles) {
        await guild.roles.create({
            id: roleData.id,
            data: {
                name: roleData.name,
                color: roleData.color,
                permissions: roleData.permissions,
                position: roleData.position,
            },
            reason: 'Restoring backup',
        });
    }

    // Apply channels
    for (const channelData of backupData.channels) {
        console.log(" ")
        console.log("RESTORING CHANNEL")
        console.log(channelData)
        console.log(" ")

        await guild.channels.create(channelData.name, {
            type: channelData.type,
            permissionOverwrites: channelData.permissions.map(perm => ({
                id: guild.roles.everyone.id,
                allow: perm.allow,
                deny: perm.deny,
            })),
            reason: 'Restoring backup',
        });
    }

    // Apply members
    for (const memberData of backupData.members) {
        const member = await guild.members.fetch(memberData.id);
        if (member) {
            await member.roles.set(memberData.roles, 'Restoring backup');
        }
    }

    // Apply emojis
    for (const emojiData of backupData.emojis) {
        await guild.emojis.create(emojiData.url, emojiData.name, {
            reason: 'Restoring backup',
        });
    }
}

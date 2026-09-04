const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription('Steals an emoji and adds it to the server.')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to steal (must be from another server)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Optional: Name for the new emoji')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
            return await interaction.reply({ content: 'You do not have permission to manage emojis.', ephemeral: true });
        }

        const emojiArg = interaction.options.getString('emoji');
        const nameArg = interaction.options.getString('name') || emojiArg.split(':')[1];

        try {
            const emojiRegex = /<(a)?:([a-zA-Z0-9_]+):([0-9]+)>/;
            const match = emojiRegex.exec(emojiArg);

            if (!match) {
                return await interaction.reply({ content: 'Invalid emoji format. Please provide a valid custom emoji.', ephemeral: true });
            }

            const [, animated, emojiName, emojiID] = match;
            const emojiURL = `https://cdn.discordapp.com/emojis/${emojiID}.${animated ? 'gif' : 'png'}`;

            console.log(typeof(emojiURL))
            console.log(emojiURL)
            const emoji = await interaction.guild.emojis.create({attachment: emojiURL, name: nameArg});

            await interaction.reply({ content: `Emoji ${emoji} has been added to the server.`, ephemeral: true });

        } catch (error) {
            console.error('Error stealing emoji:', error);
            await interaction.reply({ content: 'Failed to add emoji to the server.', ephemeral: true });
        }
    },
};

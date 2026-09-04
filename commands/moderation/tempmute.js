const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempmute')
        .setDescription('Temporarily mute a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to mute')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('The duration of the mute (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the mute')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const duration = interaction.options.getString('duration');
        const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        console.log("muted role : " + mutedRole)
        console.log("target user : " + targetUser)
        console.log("reason : " + reason)
        console.log("duration : " + duration)

        if (!mutedRole) {
            return interaction.reply({ content: 'Muted role not found.', ephemeral: true });
        }

        if (targetMember.roles.cache.has(mutedRole.id)) {
            await interaction.reply({ content: 'I cannot mute this member!', ephemeral: true });
            return;
        }

        const durationMs = ms(duration);
        if (!durationMs) {
            return interaction.reply({ content: 'Invalid duration format. Please use e.g., 10m, 1h', ephemeral: true });
        }


        await targetMember.roles.add(mutedRole, reason)
            .then(async () => {
                console.log(targetMember.roles.cache)
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('User temporarily muted')
                .setDescription(`${targetMember.user.tag} has been muted for ${duration}.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`},
                    { name: 'Reason', value: `${reason}` },
                    {   name: "duration", value: `${duration}`}
                )
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed] });
                await setTimeout(async () => {
                    if (targetMember.roles.cache.has(mutedRole.id)) {
                        await targetMember.roles.remove(mutedRole, 'Mute duration expired');
                        console.log(`Unmuted ${targetMember.user.tag} after ${duration}`);
                    }
                }, durationMs);
            })
            .catch(error => {
                console.error('Error muting member:', error);
                interaction.reply({ content: 'There was an error trying to mute this member.', ephemeral: true });
            });
    },
};


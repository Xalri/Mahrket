const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temporarily ban a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('The duration of the ban (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(target.id);

        

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('User Temporarily Banned')
            .setDescription(`${target.tag} has been banned for ${duration}.`)
            .addFields(
                { name: 'User', value: `${target.tag}`, inline: true },
                { name: 'Duration', value: `${duration}`, inline: true },
                { name: 'Reason', value: `${reason}` }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });


        const durationMs = ms(duration);
        if (!durationMs) {
            return interaction.reply({ content: 'Invalid duration format. Please use e.g., 10m, 1h', ephemeral: true });
        }


        setTimeout(async () => {
            try {
                await interaction.guild.members.unban(target.id, 'Ban duration expired');
                console.log(`Unbanned ${target.tag} after ${duration}`);
            } catch (error) {
                console.error(`Failed to unban ${target.tag}:`, error);
            }
        }, durationMs);
    },
};

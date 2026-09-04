const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), 
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!targetMember.bannable) {
            await interaction.reply({ content: 'I cannot ban this user!', ephemeral: true });
            return;
        }

        await interaction.guild.bans.create(targetMember.id, {reason: reason} )
            .then(async () => {
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('User Banned')
                .setDescription(`${targetMember.user.tag} has been banned.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'Reason', value: `${reason}` }
                )
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            // Confirm the mute with an embed
                await interaction.reply({ embeds: [embed] , ephemeral: true});
                createLog(targetUser, reason, interaction.guild)
            })
            .catch(error => {
                console.error('Error banning member:', error);
                interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
            });
    },
};

async function createLog(author, reason, guild) {

    const guild_id = guild.id

    const db = await Channels.findOne({ guild_id });

    if(!db) return

    const logChannel = await guild.channels.fetch(`${db.lochannel}`)
    // Example: Send a log message to a specific channel or save to a database
    const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("User Banned")
    .addFields({name: " ", value: `
        \`Member name\` : ${author.tag} \n
        \`Member ID\` : ${author.id} \n
        \`Reason\` : ${reason} 
        `})
    // .addFields({name: "Member name", value: `${name}`, inline: false})
    // .addFields({name: "Member ID", value: `${id}`, inline: false})
    // .addFields({name: "Reason", value: `${reason}`, inline: false})
    // .addFields({name: "Banned by", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({text: "Mod Logging System"})

    // const embed = new MessageEmbed()
    //     .setTitle('Ghost Ping Detected')
    //     .setDescription(`User ${author} mentioned ${mentionedUsers.map(user => user.toString()).join(', ')} in a message and quickly deleted it.`)
    //     .setColor('#ff0000')
    //     .setTimestamp();

    logChannel.send({ embeds: [embed] });
}
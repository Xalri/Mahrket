const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { Users } = require('../../Schemas/discord-bot-schema'); // Adjust the path as necessary

module.exports = {

    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addSubcommand(option =>
        option.setName('add')
            .setDescription('Warn a user')
            .addUserOption(option => option.setName('target').setDescription('The user to add warn to').setRequired(true))
            .addStringOption(option => option.setName('reason').setDescription('The reason of the warn').setRequired(false)))
    .addSubcommand(option =>
        option.setName('clear')
            .setDescription('Clear all user warns')
            .addUserOption(option => option.setName('target').setDescription('The user to add warn to').setRequired(true)))
    .addSubcommand(option =>
        option.setName('list')
            .setDescription('List all user warns')
            .addUserOption(option => option.setName('target').setDescription('The user to add warn to').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id)
        const SubCommand = interaction.options.getSubcommand()
        var user = await Users.findOne({ guildId: interaction.guild.id, userId: target.id })

        if (!user) {
            console.log("user ceated")
            user = Users.create({
                guildId: interaction.guild.id,
                userId: target.id,
                warnings: []
            });
        }

        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: 'I do not have the necessary permissions to manage roles or ban members.', ephemeral: true });
        if (!member) return interaction.reply({ content: 'Please specify a valid user.', ephemeral: true });


        


        switch(SubCommand){
            case "add":

                const reason = interaction.options.getString('reason')
                console.log(user)

                const warnEmbed = new EmbedBuilder()
                    .setColor('#ff9900')
                    .setTitle('User Warned')
                    .setDescription(`${target.tag} has been warned.`)
                    .addFields(
                        { name: 'User', value: `${target.tag}`, inline: true },
                        { name: 'Warnings', value: `${user.warnings.length + 1}`, inline: true },
                        { name: 'Reason', value: `${reason}` }
                    )
                    .setTimestamp();


                switch(user.warnings.length){
                    case 2:
                        var sanction = "TempMute"
                        await interaction.channel.send({ embeds: [warnEmbed] });
                        await executeCommand(interaction, 'tempmute', { target, reason, duration: '10m' });
                        break;
                    
                    case 4:
                        var sanction = "Mute"
                        await interaction.channel.send({ embeds: [warnEmbed] });
                        await executeCommand(interaction, 'mute', { target, reason });
                        break;

                    case 6:
                        var sanction = "TempBan"
                        await interaction.channel.send({ embeds: [warnEmbed] });
                        await executeCommand(interaction, 'tempban', { target, reason, duration: '1d' });
                        break;

                    case 8:
                        var sanction = "Ban"
                        await interaction.channel.send({ embeds: [warnEmbed] });
                        await executeCommand(interaction, 'ban', { target, reason });
                        break;

                    default:
                        var sanction = "No sanction"
                        await interaction.reply({ embeds: [warnEmbed] });
                        break;
                }

                user.warnings.push({target: target.id, author: interaction.user.id, reason: reason, sanction: sanction});
                await user.save();
                break;
            
            case "clear":
                try {
                    user.warnings = [];
                    await user.save();
        
                    const clearWarnEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle(`Warnings clear`)
                        .setDescription(`Warnings cleared for ${target.tag}.`)
                        .setTimestamp();
        
                    interaction.reply({ embeds: [clearWarnEmbed]});
                } catch (error) {
                    console.error('Error clearing warnings:', error);
                    interaction.reply({ content: 'An error occurred while clearing warnings.', ephemeral: true });
                }
                break;
            
            case "list":
                if(user.warnings.length === 0){
                    const noWarnEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('User Warnings')
                        .setDescription(`${member.user.username} has no warnings 👏.`)
                        .setTimestamp();
                        
                    return interaction.reply({embeds: [noWarnEmbed]})
                }
        
        
                
        
                
        
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`${member.user.username} Warnings`)
                    .setTimestamp();
        
                let i = 0
        
                for (const warn of user.warnings) {
                    i ++
                    const author = await interaction.guild.members.fetch(warn.author);
                    console.log(warn);
                    embed.addFields({name: `${i}. ${author.user.username}`, value: `\`Reason\`: ${warn.reason} \n\`Sanction\`: ${warn.sanction}`,});
                    embed.addFields({name: " ", value: " "})
                }
        
                interaction.reply({embeds: [embed]})

        }
    },
};


async function executeCommand(interaction, commandName, options) {
    const command = interaction.client.commands.get(commandName);
    if (!command) return;
 
    // Simulate a new interaction with the necessary options as you can see here.
    const simulatedInteraction = {
        ...interaction,
        options: {
            getUser: (name) => options[name],
            getString: (name) => options[name],
        },
        reply: interaction.reply.bind(interaction),
        channel: interaction.channel,
        guild: interaction.guild,
        member: interaction.member,
        client: interaction.client,
    };
 
    await command.execute(simulatedInteraction);
}

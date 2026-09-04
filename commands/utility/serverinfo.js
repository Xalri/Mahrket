const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color

        const guildOwner = await interaction.guild.members.fetch(interaction.guild.ownerId);
        if (!guildOwner) {
            return await interaction.reply('Unable to fetch guild owner information.');
        }
        const ownerUser = guildOwner.user;
        if (!ownerUser) {
            return await interaction.reply('Unable to fetch user information for guild owner.');
        }




        const embed = new EmbedBuilder()
        
            .setDescription('Server Information')
            .setTitle('Server Information')
            .setColor(`${randomColor}`)
            .setThumbnail(guild.iconURL({ dynamic: true }) || undefined)
            .addFields({name:'Name', value: guild.name})
            .addFields({name:'ID', value: guild.id})
            .addFields({name:'Owner', value: ownerUser.globalName})
            .addFields({name:'Members', value: guild.memberCount.toString()})
            .addFields({name:'Roles', value: guild.roles.cache.size.toString()})
            .addFields({name:'Boost Level', value: guild.premiumTier.toString()})
            .addFields({name:'Boosts', value: guild.premiumSubscriptionCount.toString()})
            .addFields({name:'Created At', value: guild.createdAt.toLocaleDateString()})
            .setFooter({ 
                text: `Requested by ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        
    },
};

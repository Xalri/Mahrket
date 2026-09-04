const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays information about the bot.'),
  
  async execute(interaction) {
    const client = interaction.client;
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color


    const embed = new EmbedBuilder()
    .setColor(`${randomColor}`)
    .setTitle('Bot Information')
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
        { name: 'Bot Name', value: client.user.username, inline: true },
        { name: 'Bot ID', value: client.user.id, inline: true },
        { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
        { name: 'Users', value: client.users.cache.size.toString(), inline: true },
        { name: 'Channels', value: client.channels.cache.size.toString(), inline: true },
        { name: 'Creation Date', value: (await client.users.fetch(client.user.id)).createdAt.toDateString(), inline: true }
    )
    .setFooter({ 
        text: `Requested by ${interaction.user.tag}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
    })
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

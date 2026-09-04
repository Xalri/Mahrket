const { Events, EmbedBuilder } = require('discord.js');
const db = require('../utils.js');
const { Channels } = require('../Schemas/discord-bot-schema.js')


module.exports = {
	name: Events.MessageReactionAdd ,
	async execute(reaction, user) {

        
        if(user.bot)return

        try {
            // Check if the guild exists in the database
            var Guild = await Channels.findOne({ guild_id: reaction.message.guildId });
            
            // If the guild doesn't exist in the database, register it
            if (!Guild) {
                Guild = Channels.create({
                guild_id: interaction.guild.id
            });
                // await Guild.save();
                console.log(`Registered new guild: ${interaction.guild.name} (${interaction.guild.id})`);
            }
        } catch (err) {
            console.error('Error checking or registering guild:', err);
        }
        
        if(reaction.message.channelId === Guild.rechannel){
            if (reaction.emoji.name === '✅') {
                // Fetch the message
                const message = await reaction.message.fetch();
                
                // Ensure the message contains an embed
                if (message.embeds.length > 0) {
                    const embed = message.embeds[0];
        
                    // Update embed color to green
                    embed.data.color = 65280
        
                    // Update the message with the new embed color
                    await message.edit({ embeds: [embed] });
                }
            }
        }
    },
};

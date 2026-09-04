const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { Channels } = require('../Schemas/discord-bot-schema.js')


module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {


        let channels = await Channels.findOne({ guild_id: channel.guild.id })
        if(!channels){
            try {
                await Channels.create({
                    guild_id: channel.guild.id,
                });

                console.log(`Channel added to database on join.`);
            } catch (error) {
                console.error('Error adding user to database on join:', error);
            }
            
        }


        if(channels.lochannel !== ""){

            channel.guild.fetchAuditLogs({
            
                type: AuditLogEvent.ChannelDelete,
            })
            .then( async (audit) => {
                const { executor} = audit.entries.first()
                
                const name = channel.name
                const id = channel.id
                let type = channel.type;


                switch(type){
                    case 0:
                        type = 'Text';
                        break;
                    case 2:
                        type = 'Voice';
                        break;
                    case 13:
                        type = 'Stage';
                        break;
                    case 15:
                        type = 'Form';
                        break;
                    case 5:
                        type = 'Announcement';
                        break;
                    case 4:
                        type = 'Category';
                        break;
                }


                const channelID = channels.lochannel;
                await channel.guild.channels.fetch()
                const mChannel = await channel.guild.channels.cache.get(channelID);
                if(!mChannel) return
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Channel Deleted")
                    .addFields({name: " ", value: `\`Channel name\` : ${name} \n\`Channel type\` : ${type} \n\`Channel ID\` : ${id} \n\`Deleted by\` : ${executor.tag} `})
                    .setTimestamp()
                    .setFooter({text: "Mod Logging System"})
                mChannel.send({embeds: [embed]} )
            })
        }
        
        
    },
};

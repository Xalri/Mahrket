const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');
const { Channels } = require('../Schemas/discord-bot-schema.js')


module.exports = {
    name: Events.GuildBanRemove,
    async execute(ban) {


        let channels = await Channels.findOne({ guild_id: ban.guild.id })
        if(!channels){
            try {
                await Channels.create({
                    guild_id: ban.guild.id,
                });

                console.log(`Channel added to database on join.`);
            } catch (error) {
                console.error('Error adding user to database on join:', error);
            }
            
        }


        if(channels.lochannel !== ""){

            ban.guild.fetchAuditLogs({
            
                type: AuditLogEvent.GuildBanRemove,
            })
            .then( async (audit) => {
                const { executor} = audit.entries.first()
                
                const name = ban.user.tag
                const id = ban.user.id
                const reason = ban.reason




                const channelID = channels.lochannel;
                await ban.guild.channels.fetch()
                const mChannel = await ban.guild.channels.cache.get(channelID);
                if(!mChannel) return
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Membed Unbanned")
                    .addFields({name: " ", value: `
                        \`Member name\` : ${name} \n
                        \`Member ID\` : ${id} \n
                        \`Ban reason\` : ${reason} \n
                        \`Banned by\` : ${executor.tag} 
                        `})
                    .setTimestamp()
                    .setFooter({text: "Mod Logging System"})
                mChannel.send({embeds: [embed]} )
            })
        }
        
        
    },
};

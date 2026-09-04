const { Events, EmbedBuilder } = require('discord.js');
const db = require('../utils.js');
const { Channels } = require('../Schemas/discord-bot-schema.js')


module.exports = {
    name: Events.MessageDelete,
    async execute(deletedMessage) {
        
        // if (deletedMessage.author.bot) return;


        if(!deletedMessage.author) return

        if(deletedMessage.author.bot) return

        const mentionedUsers = deletedMessage.mentions.users;

        if (mentionedUsers.size > 0) {
            const deletionTime = new Date() - deletedMessage.createdTimestamp - 20000;

            const quickDeletionThreshold = 5000; 

            if (deletionTime <= quickDeletionThreshold) {
                const warningMessage = await deletedMessage.channel.send(`${deletedMessage.author}, you can't ghost ping other users.`);

                
                createLog(deletedMessage.author, mentionedUsers.first(), deletedMessage.guild);

                setTimeout(() => {
                    warningMessage.delete();
                }, 5000); 
            }
        }
    },
};

async function createLog(author, mentionedUsers, guild) {

    const guild_id = guild.id

    const db = await Channels.findOne({ guild_id });

    if(!db) return

    const logChannel = await guild.channels.fetch(`${db.lochannel}`)
    // Example: Send a log message to a specific channel or save to a database
    const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Ghost Ping Detected")
    .addFields({name: " ", value: `\`Member name\` : ${author.tag} \n\`Member ID\` : ${author.id} \n\`Pinged user\` : ${mentionedUsers.tag} `})
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
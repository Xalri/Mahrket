const { Events, EmbedBuilder } = require('discord.js');
const db = require('../utils.js');
const { Channels } = require('../Schemas/discord-bot-schema.js')


module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        
        if(member.user.bot){
            return
        }
        
        let gochannel = await Channels.findOne({ guild_id: member.guild.id }) ? await Channels.findOne({ guild_id: member.guild.id }) : 0

		if(gochannel !== 0){
			leaveChannel = member.guild.channels.cache.get(gochannel.gochannel)
		

            try {
                const joinedAt = member.joinedAt;
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const joinedDate = joinedAt.toLocaleDateString('fr-FR', options);
                
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle(`Goodbye, <@${member.user.id}>!`)
                    .setDescription('We are sad to see you leave.')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Left Server On', value: new Date().toDateString('fr-FR', {timeZone: "Europe/Paris"}) },
                        {name: "Joined Server On", value: joinedDate},
                        { name: 'Account Created On', value: member.user.createdAt.toDateString() }
                    )
                    .setFooter({ 
                        text: 'Come back soon!', 
                        iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();
                await leaveChannel.send({ embeds: [embed] });
                await createLog(member, member.guild)
                console.log('Leave message sent');
            } catch (error) {
                console.error('Error sending custom leave message:', error);
            }
        }
    },
};


async function createLog(member, guild) {

    const guild_id = guild.id

    const db = await Channels.findOne({ guild_id });

    if(!db) return

    const logChannel = await guild.channels.fetch(`${db.lochannel}`)
    // Example: Send a log message to a specific channel or save to a database
    const embed = new EmbedBuilder()
    .setColor("Red")
        .setTitle("Member Leaved")
        .addFields({name: " ", value: `\`Member name\` : ${member.user.tag} \n\`Member ID\` : ${member.id} \n\`Left Server On\` : ${new Date().toDateString('fr-FR', {timeZone: "Europe/Paris"})} \n\`Joined Server On\` :  ${member.joinedAt.toDateString()} \n\`Account Created On\` :  ${member.user.createdAt.toDateString()}`})
        .setTimestamp()
        .setFooter({text: "Mod Logging System"})

    // const embed = new MessageEmbed()
    //     .setTitle('Ghost Ping Detected')
    //     .setDescription(`User ${author} mentioned ${mentionedUsers.map(user => user.toString()).join(', ')} in a message and quickly deleted it.`)
    //     .setColor('#ff0000')
    //     .setTimestamp();

    logChannel.send({ embeds: [embed] });
}
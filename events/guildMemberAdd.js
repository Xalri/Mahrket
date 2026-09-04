const { Events, PermissionsBitField, EmbedBuilder, AttachmentBuilder, channelLink } = require('discord.js');
const { generateCaptcha } = require('../utils.js')
const { Channels, Users } = require('../Schemas/discord-bot-schema.js')

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {

        if(member.user.bot) return


        




        let user = await Users.findOne({ userId: member.user.id })
        if(!user){
            try {
                await Users.create({
                    guildId: member.guild.id,
                    userId: member.id,
                });

                console.log(`User ${member.user.tag} added to database on join.`);
            } catch (error) {
                console.error('Error adding user to database on join:', error);
            }
            
        }
	    
		let wechannel = await Channels.findOne({ guild_id: member.guild.id }) ? await Channels.findOne({ guild_id: member.guild.id }) : 0

		if(wechannel !== 0){
			joinChannel = member.guild.channels.cache.get(wechannel.wechannel)


            
            
            if (joinChannel === "") return;

           
            
        
            if (joinChannel) {
                try {
                //     // Prevent Discord from sending its default message
                //     joinChannel.messages.fetch({ limit: 1 }).then(messages => {
                //     messages.first().delete();
                // }).catch(console.error);
        
                // Send custom welcome message
                
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Welcome to the server, <@${member.user.id}>!`)
                    .setDescription('Happy to see you.')
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {name:'Joined Server On', value:member.joinedAt.toDateString()},
                        {name:'Account Created On', value:member.user.createdAt.toDateString()}
                        )
                    .setFooter({ 
                        text: 'Enjoy the server!', 
                        iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();
                await joinChannel.send({ embeds: [embed] });
                await createLog(member, member.guild)
                } catch (error) {
                    console.error('Error sending custom join message:', error);
                }
            }
		}




        let captchaChannel = await Channels.findOne({ guild_id: member.guild.id }) ? await Channels.findOne({ guild_id: member.guild.id }) : 0
        if(wechannel !== 0){
			captchaChannel = member.guild.channels.cache.get(captchaChannel.cachannel)
        }
        if(!captchaChannel) return

        member.guild.channels.cache.forEach(async (channel) => {
            await channel.permissionOverwrites.edit(member.id, {
                ViewChannel: false,
            });
        });

        captchaChannel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            SendMessages: true,
        })


        let captcha = await generateCaptcha()
        console.log("CAPTCHA : " + captcha.text)

        let msg = await captchaChannel.send({content: `<@${member.user.id}>, you have 2 minutes to complete the captcha. If you don't complete it, you will be kick from the server`, files: [new AttachmentBuilder((await captcha.canvas).toBuffer(), {name: "caaptcha.png"})]})
    

        try{
            let filter = m => m.author.id === member.user.id
            let response = (await captchaChannel.awaitMessages({filter, max: 1, time: 120000, errors: ["time"]})).first()  

            if(response.content === captcha.text){
                await msg.delete()
                await response.delete()
                try {await member.user.send("You completed the captcha !")} catch(err) {}
                member.guild.channels.fetch()
                member.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.delete(member.id);
                });
                return captchaChannel.permissionOverwrites.edit(member.id, {
                    ViewChannel: false,
                })

            }else{
                await msg.delete()
                await response.delete()
                try {await member.user.send("You failed the captcha !")} catch(err) {}
                return await member.kick("Captcha failed")
            }

        }catch(err){
            console.log("ERROR GUILD MEMBER ADD: " + err)
            await msg.delete()
            try {await member.user.send("You took too long to complete the captcha !")} catch(err) {}
            await member.kick("Captcha not completed")
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
        .setTitle("Member Joined")
        .addFields({name: " ", value: `\`Member name\` : ${member.user.tag} \n\`Member ID\` : ${member.id} \n\`Joined Server On\` :  ${member.joinedAt.toDateString()} \n\`Account Created On\` :  ${member.user.createdAt.toDateString()}`})
        .setTimestamp()
        .setFooter({text: "Mod Logging System"})

    // const embed = new MessageEmbed()
    //     .setTitle('Ghost Ping Detected')
    //     .setDescription(`User ${author} mentioned ${mentionedUsers.map(user => user.toString()).join(', ')} in a message and quickly deleted it.`)
    //     .setColor('#ff0000')
    //     .setTimestamp();

    logChannel.send({ embeds: [embed] });
}

const { Events, ChannelType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { Channels, Users, Mod, Counting } = require('../Schemas/discord-bot-schema.js')
const { OpenAI } = require("openai");
const { getRoles } = require('../utils.js');
let { guildId } = require('../config');
const deploy_commands = require('../deploy_commands.js');


let cooldown = false

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        
        // if(!message.guild){
        //     return
        // }

        if(message.author.bot) return


        if(message.content === "₴Ʉ₽ɌɆ₵₳₴Ɇ-₦₳Ⱡ₥Ʉɍ-ⱧɄ₲ɆⱤ") deploy_commands()
            

        


        if(message.channel.type === ChannelType.DM){
            const guild = await message.client.guilds.fetch({id: `${guildId}`}.id)
            const member = message.author

            let data = await Mod.findOne({guildId: guild.id, user: member.tag})
            
            if(!data){
                data = await Mod.create({ guildId: guild.id, user: member.tag})
                data.save()
            }

            // if(data){
            //     data = await Mod.create({ guildId: guild.id, user: member.id})
            //     data.save()
            // }




            

            if(message.attachments.size  > 0){
                message.react('❌')
                return member.send('i cannot send this message!')
            }


            const posChannel = guild.channels.cache.find(c => c.name === `${message.author.tag}`)

            if(posChannel){
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setAuthor({name: `${message.author.username}`, iconUrl: `${message.author.displayAvatarURL()}`})
                .setDescription(`${message.content}`)

                posChannel.send({embeds: [embed]})
                message.react('✉️')
                return
            }


            let Category = await guild.channels.cache.find(c => c.name === "modmail")
            if(!Category){
                Category = await guild.channels.create({
                    name: "modmail",
                
                    type: ChannelType.GuildCategory, 

                    permissionOverwrites : [{
                        id: guild.roles.everyone,

                        deny: [PermissionFlagsBits.ViewChannel]
                    }]
                })
            }

            adminRoles = await getRoles(guildId, {isAdmin: true})
            
            ownerRole = await getRoles(guildId, {name: "Owner"})

            const channel = await guild.channels.create({
                name: message.author.tag,
            
                type: ChannelType.GuildText, 

                parent: Category.id,

                topic: `A mail sent by ${message.author.tag}`,
            
                permissionOverwrites: [{
                    id: guild.roles.everyone,

                    deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
                }]
            })

            adminRoles.forEach(async (role) => {
                channel.permissionOverwrites.edit(role.id, {
                    ViewChannel: true,
                    SendMessages: true
                })
            })


            member.send(`Your modmail conversation has been start in ${guild.name}`)

            const embed = new EmbedBuilder()
                .setTitle('NEW MODMAIL')
                .setColor('Blue')
                .setAuthor({name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
                .setDescription(`${message.content}`)
                .setTimestamp()
                .setFooter({ text: "Use the button below to close this mail"})

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('button')
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Close')
                        .setEmoji('🔒')
                )


            const m = await channel.send({embeds: [embed], components: [button]})

            const collector = m.createMessageComponentCollector();
            collector.on('collect', async (i) => {
                if(i.customId === 'button'){
                    await channel.delete()
                    message.channel.send(`Your modmail conversation in ${guild.name} has been closed by a moderator`)
                }
            })

            m.pin()
            message.react('✉️')





        }
        if(message.channel.type === ChannelType.GuildText){
            guildId = message.guild.id
            const guild_id = `${guildId}`
            const guild = await message.client.guilds.fetch({id: `${guildId}`}.id)
            const db = await Channels.findOne({ guild_id });
            const data = await Mod.findOne({ guildId: guild.id, user: message.channel.name})
            const member = await message.guild.members.fetch(message.author.id);



            if(data && message.channel === await guild.channels.cache.find(c => c.name === data.user)) {
                
                await guild.channels.fetch()
                const colChannel = await guild.channels.cache.find(c => c.name === data.user)
    
                if(message.channel === colChannel){
    
                    const memberTag = data.user
                    const member = await message.client.users.cache.find(user => user.username == memberTag)
    
                    if(message.attachments.size  > 0){
                        message.react('❌')
                        return member.send('i cannot send this message!')
                    }
    
                    message.react('✉️')
    
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setAuthor({name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
                        .setDescription(`${message.content}`)
    
                    member.send({embeds: [embed]})
    
    
                }
            }else if(db.cochannel !== undefined && message.channel.id === db.cochannel){
                let data2 = await Counting.findOne({ Guild: guild.id})
                if(!data2) {
                    data2 = await Counting.create({ Guild: guild.id, Number: 1})
                }
                const number = Number(message.content)
                if ( number !== data2.Number){
                    await message.react('❌')
                    tempMsg = await message.reply('❌ Someone typed the wrong number. Number reset to 0')
                    await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                        SendMessages: false,
                    });
                    data2.Number = 1
                    data2.LastUser = ''
                    await data2.save()
                    setTimeout(async () => {
                        await tempMsg.delete()
                        await message.channel.messages.fetch({ limit: 100, cache: false }).then(async (messages) => {
                            messages.forEach(async (message) => {await message.delete()})
                        })
                        const embed = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Counting Game')
                            .setDescription(`Current Number: ${data2.Number - 1}`);
                        message.channel.send({embeds: [embed]})
                        await message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, {
                            SendMessages: true,
                        });
                    }, 5000)
                } else if (data2.LastUser === message.author.id){
                    await message.react('❌')
                    tempMsg = await message.reply('❌ Someone else has to count that number')
                    setTimeout(async () => {
                        await tempMsg.delete()
                    }, 5000)
                } else{
                    await message.react('✅')
                    data2.LastUser = message.author.id
                    data2.Number++;
                    await data2.save()
                }
            }else if(db.aichannel !== undefined && db.aichannel === message.channel.id) {
                if(db.aichannel === message.channel.id) {
                    
                    
                    
    
                    if(member.roles.cache.some(role => role.name === 'Premium' || role.name === 'VIP' || role.name === 'AI access')){
                        if (cooldown) {
                            return message.channel.send(`Please wait a few seconds before using this command again.`);
                        }else{
                            cooldown = true;
                            setTimeout(() => {
                                cooldown = false;
                            }, 5000); 
        
                        }
    
                    }
                    
                    
                    
                    
                    
                    
                    let max_token = 0
                    if(member.roles.cache.some(role => role.name === 'AI access')){
                        max_token = 25    
                        const userData = await Users.findOne({ guildId: message.guild.id, userId: message.author.id });
                        if(userData.ai === 0){
                            return message.channel.send("You used all your free tokens today. Please wait until tommorow to retry or get a special role")
                        } else{
                            userData.ai -= 1
                            userData.save()
                            if(userData.ai === 0){
                                message.channel.send("You used your last daily free token in this request.")
                            }
                        }   
                    }else if(member.roles.cache.some(role => role.name === 'Premium')){
                        max_token = 50
                    }else if(member.roles.cache.some(role => role.name === 'VIP')){
                        max_token = 75
                    }else{
                        return
                    }
                    
                    
                    
                    
                    
                    const openai = new OpenAI({
                        apiKey: require('../config').openaiApiKey
                    })
                    
                    const channel = message.channel
                    let messages = await channel.messages.fetch()
                    
                    let prompt = ``
                    for (const [key, m] of messages.reverse()) {
                        try {
                            // const member = await message.guild.members.fetch(m.author.id);
                            // prompt += `${member.user.username}: ${m.content}\n`;
                        } catch (err) {
                            console.error("Error fetching member: ", err);
                        }
                    }
    
                    
                    
                    prompt += `${message.author.username}: ${message.content}\n`;
    
                    
                    const chatCompletion = await openai.chat.completions.create({
                        messages: [
                            {role:'system', content: 'you are an assistant in a discord server, you try to help everyone who needs help.'},
                            { role: 'user', content: prompt }
                        ],
                        model: 'gpt-3.5-turbo',
                        max_tokens: max_token
                    }).catch((err) => console.error("OpenAI Error " + err))
    
                    console.log("token used -> " + chatCompletion.usage.total_tokens)
                    
                    
                    message.channel.send(`${chatCompletion.choices[0].message.content}`)
                }
            }else if(db.anchannel !== undefined && db.anchannel === message.channel.id) {
                if (message.content.startsWith('!announce') && member.roles.cache.some(role => role.name === 'Owner' || role.name === 'Moderator')) {
                    const announcementContent = message.content.slice('!announce'.length).trim();
                    
                    if (!announcementContent) {
                        return message.reply('Please provide an announcement message.');
                    }
            
                    try {
                        // Delete the original message
                        await message.delete();
            
                        // Create an embed for the announcement
                        const announcementEmbed = new EmbedBuilder()
                            .setTitle('📢 Announcement')
                            .setDescription(announcementContent)
                            .setColor('#FF0000')
                            .setFooter({ text: `Announced by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp();
            
                        // Send the embed with @everyone mention
                        await message.channel.send({ content: '@everyone', embeds: [announcementEmbed] });
                    } catch (error) {
                        console.error('Error creating announcement:', error);
                        message.channel.send('There was an error trying to make the announcement.');
                    }
                }
            }
        }
        if(message.author.bot && message.interaction){
			if (!message.content) {
				setTimeout(() => {
					
					console.log(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: (Embed)`);
					console.log('\x1b[32m%s\x1b[0m', `[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] EMBED`)
					message.embeds.forEach(embed => {
						
						embed.fields.forEach(field => {
							console.log(`  ${field.name}: ${field.value}`);
						});
		
						console.log('\x1b[32m%s\x1b[0m', '-------------------');
					});
				}, 1000);
			}else{
				setTimeout(() => {
				
					process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: `);
					console.log('\x1b[32m%s\x1b[0m', `${message.content}`);
			}, 1000);
			}
		
		}else{
			process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: `);
			console.log('\x1b[90m%s\x1b[0m', `${message.content}`);
		}
		
    }
};

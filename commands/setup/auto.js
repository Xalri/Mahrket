const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { Channels } = require('../../Schemas/discord-bot-schema.js')




const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

  }







module.exports = {

	data: new SlashCommandBuilder()

		.setName('auto')

		.setDescription('automatically create channels'),

	async execute(interaction) {





        // console.log("isSetup : " + config.isSetup)



        // if (config.isSetup === true){

        //     console.log("already setup")

        //     interaction.reply({content:"Server already setup, pls use /setup to setup it (again)", ephemeral: true})

        // }else{

        if (true){





            interaction.guild.channels.fetch().then(channels => channels.forEach(channel => channel.delete()))





            let welcome_channel;

            let command_channel;

            const arriving_emoji = "🛬"

            const departure_emoji = "🛫";

            const robot_emoji = "🤖"

            const speech_emoji = "💬"

            const vocal_emoji = "🔊"



            const guild_id = interaction.guild.id



            // await sleep(1000)



            let travel_category;



            console.log("TRAVEL CATEGORY ########################################")

            

            console.log(travel_category = await interaction.guild.channels.create({name: "traveler", type: ChannelType.GuildCategory }));



            console.log("END TRAVEL CATEGORY ########################################")



            const main_category = await interaction.guild.channels.create({name: "main", type: ChannelType.GuildCategory });

            const vocal_category = await interaction.guild.channels.create({name: "vocals", type: ChannelType.GuildCategory });

        



            // await sleep(1000)





            welcome_channel = await interaction.guild.channels.create({ 

                name: arriving_emoji + "・Welcome",

                type: ChannelType.GuildText, 

                permissionOverwrites: [{ 

                    id: interaction.guild.id,

                    allow: [PermissionFlagsBits.ViewChannel],

                    deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]

                }]

            });


            welcome_channel.setParent(travel_category.id)











            command_channel = await interaction.guild.channels.create({ 

                name: robot_emoji + "・bot ",

                type: ChannelType.GuildText, // syntax has changed a bit

                permissionOverwrites: [{ // same as before

                    id: interaction.guild.id,

                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],

                    deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]

                }]

            });


            command_channel.setParent(main_category.id)











            goodbye_channel = await interaction.guild.channels.create({ 

                name: departure_emoji + "・Goodbye",

                type: ChannelType.GuildText, // syntax has changed a bit

                permissionOverwrites: [{ // same as before

                    id: interaction.guild.id,

                    allow: [PermissionFlagsBits.ViewChannel],

                    deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]

                }]

            });


            goodbye_channel.setParent(travel_category.id)









            general_channel = await interaction.guild.channels.create({ 

                name: speech_emoji + "・general",

                type: ChannelType.GuildText, // syntax has changed a bit

                permissionOverwrites: [{ // same as before

                    id: interaction.guild.id,

                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],

                    deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]

                }]

            });


            general_channel.setParent(main_category.id)





            vocal_channel = await interaction.guild.channels.create({ 

                name: vocal_emoji + "・general",

                type: ChannelType.GuildVoice, 

                permissionOverwrites: [{ 

                    id: interaction.guild.id,

                    allow: [PermissionFlagsBits.Speak, PermissionFlagsBits.Connect, PermissionFlagsBits.UseVAD],

                    deny: [PermissionFlagsBits.PrioritySpeaker, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.ManageChannels]

                }]

            });

            module.exports.gchannel = general_channel

            vocal_channel.setParent(vocal_category.id)

            try {
                // Find the Channel document for the guild_id
                const channelDoc = await Channels.findOne({ guild_id });
          
                if (channelDoc) {
                  // Update the channel field with interaction.channel.id
                    channelDoc.cchannel = command_channel;
                    channelDoc.gechannel = general_channel;
                    channelDoc.gochannel = goodbye_channel;
                    channelDoc.wechannel = welcome_channel;
                    await channelDoc.save();
                } else {
                    interaction.reply('Channel schema not found for the guild.');
                }
            } catch (err) {
                console.error('Error updating Channel schema:', err);
                interaction.reply('Failed to update Channel schema.');
            }








            command_channel.send("Succefuly created channels <#" + welcome_channel.id + ">,  <#" + command_channel.id + ">, <#" + goodbye_channel.id + "> and <#" + general_channel.id + ">")

            config.isSetup = true

            module.exports.isAuto = true

            module.exports.isConfig = true

        }

	},

};
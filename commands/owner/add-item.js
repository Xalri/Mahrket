
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createChannel } = require('./auto');
const { Channels } = require('../../Schemas/discord-bot-schema.js')
const { getRoles } = require('../../utils.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-item')
        .setDescription('Adds a new item to the shop.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        try {
            // Check if the guild exists in the database
            var Guild = await Channels.findOne({ guild_id: interaction.guild.id });
            
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
        const guild = interaction.guild;
        const categoryName = 'shop';

        // Check if the shop category exists, create it if not
        let shopCategory = guild.channels.cache.find(channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory);
        if (!shopCategory) {
            try {
                shopCategory = await interaction.guild.channels.create({name: categoryName, type: ChannelType.GuildCategory });
            } catch (error) {
                console.error('Error creating shop category:', error);
                return interaction.reply({ content: 'Failed to create shop category.', ephemeral: true });
            }
        }

        try {

            var adminRoles = await getRoles(interaction.guild, {isAdmin: true})
            
            var ownerRole = await getRoles(interaction.guild, {name: "Owner"})
            // Create a new text channel for item details input
            var createdChannel = await createChannel(
                interaction.guild, 
                
                `item-details`, 
                
                ChannelType.GuildText, 

                shopCategory.id,
                
                [{ // same as before

                    id: interaction.guild.roles.everyone,
        
                    deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
        
                }]
            )

            adminRoles.forEach(async (role) => {
                createdChannel.permissionOverwrites.edit(role.id, {
                    ViewChannel: true,
                })
            })

            ownerRole.forEach(async (role) => {
                createdChannel.permissionOverwrites.edit(role.id, {
                    ViewChannel: true,
                    SendMessages: true,
                })
            })


            interaction.reply({content: `Channel created, please fill in the informations -> <#${createdChannel.id}>`, ephemeral: true})





            var tempMessage = await createdChannel.send("Enter item name: ")

            // Filter to only listen for messages in the newly created channel
            const filter = m => m.channelId === createdChannel.id && m.author.id === interaction.user.id;

            // Message collector to gather item details
            const collector = createdChannel.createMessageCollector({ filter, time: 300000, max: 5 }); // Adjust time and max as needed

            let itemDetails = {};

            collector.on('collect', async message => {
                if (!itemDetails.name) {
                    itemDetails.name = message.content;
                    await tempMessage.delete()
                    await message.channel.send(`Name set to: ${itemDetails.name}`);
                    tempMessage = await message.channel.send(`Enter item description: `);
                } else if (!itemDetails.description) {
                    itemDetails.description = message.content;
                    await tempMessage.delete()
                    await message.channel.send(`Description set to: ${itemDetails.description}`);
                    tempMessage = await message.channel.send(`Enter item price for basic user: `);
                } else if (!itemDetails.general) {
                    itemDetails.general = message.content;
                    await tempMessage.delete()
                    await message.channel.send(`Price for basic user set to: ${itemDetails.general}`);
                    tempMessage =  await message.channel.send(`Enter item price for VIP: `);
                } else if (!itemDetails.vip) {
                    itemDetails.vip = message.content;
                    await tempMessage.delete()
                    await message.channel.send(`Price for VIP set to: ${itemDetails.vip}`);
                    tempMessage = await message.channel.send(`Enter item price for Premium: `);
                } else if (!itemDetails.premium) {
                    itemDetails.premium = message.content;
                    
                    // tempMessage = await message.channel.send(`Price for Premium set to: ${itemDetails.premium}`);
                }

                if (Object.keys(itemDetails).length === 5) {
                    // All details collected, ask for role-specific prices
                    collector.stop('global_details_collected');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason !== 'global_details_collected') {
                    // Collector ended without collecting all global details
                    await interaction.channel.send({ content: 'Item creation canceled or timed out.', ephemeral: true });
                }else{
                    const embed = new EmbedBuilder()
                        .setColor(`#008080`)
                        .setTitle(`${itemDetails.name}`)
                        .setDescription(`${itemDetails.description}`)
                        .addFields({name: "Price", value: `\`Basic user\`: ${itemDetails.general}€\n\`VIP user\`: ${itemDetails.vip}€\n\`Premium user\`: ${itemDetails.premium}€`})
                        .setFooter({ 
                            text: `Requested by ${interaction.user.tag}`, 
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                        })
                        .setTimestamp();
                    
                    await createdChannel.bulkDelete(10)
                    await createdChannel.send({ embeds: [embed] });
                    await createdChannel.setName(`🛒・${itemDetails.name}`)
                    await createdChannel.send("Buy -> <#" + Guild.tichannel + ">")
                    
                    createdChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        ViewChannel: true,
                    })
                }
            });

            

        } catch (error) {
            console.error('Error creating item channel:', error);
            await interaction.reply({ content: 'Failed to create item channel.', ephemeral: true });
        }
    },
};




async function askForRolePrices() {
    // Fetch roles for which prices need to be set
    const rolesToAsk = ['VIP', 'Premium', ""]; // Add more roles as needed

    for (const roleName of rolesToAsk) {
        const role = guild.roles.cache.find(r => r.name === roleName);
        if (!role) {
            await interaction.reply({ content: `Role "${roleName}" not found! Skipping.`, ephemeral: true });
            continue;
        }

        // Ask for price for this role
        await createdChannel.send(`Enter price for "${roleName}":`);

        // Wait for user response
        const response = await createdChannel.awaitMessages({
            max: 1,
            time: 60000, // Adjust timeout as needed
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id,
        });

        const priceInput = response.first().content;
        const price = parseFloat(priceInput);

        if (isNaN(price)) {
            await createdChannel.send(`Invalid price input. Please enter a valid number for role "${roleName}".`);
            continue;
        }

        // Store or process the price as needed
        // Example: Store in MongoDB, update a global item object, etc.
        await createdChannel.send(`Price for role "${roleName}" set to: ${price.toFixed(2)}`);

        // Clean up response
        await response.first().delete();
    }

    // Optionally, finalize the item creation process
    // Example: Store all gathered information in MongoDB, send confirmation message, etc.
    await interaction.reply({ content: 'Item added successfully!', ephemeral: true });

    // Check if shop category has no items (channels), remove it if empty
    const channelsInCategory = guild.channels.cache.filter(channel => channel.parentId === shopCategory.id);
    if (channelsInCategory.size === 0) {
        try {
            await shopCategory.delete();
            console.log('Shop category deleted due to no items.');
        } catch (error) {
            console.error('Error deleting shop category:', error);
        }
    }
}
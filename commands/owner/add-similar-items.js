const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createChannel } = require('./auto');
const { Channels } = require('../../Schemas/discord-bot-schema.js');
const { getRoles } = require('../../utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-similar-items')
        .setDescription('Adds multiple items with the same price to the shop.'),

    async execute(interaction) {
        try {
            // Check if the guild exists in the database
            var Guild = await Channels.findOne({ guild_id: interaction.guild.id });

            // If the guild doesn't exist in the database, register it
            if (!Guild) {
                Guild = Channels.create({
                    guild_id: interaction.guild.id
                });
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
                shopCategory = await interaction.guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory });
            } catch (error) {
                console.error('Error creating shop category:', error);
                return interaction.reply({ content: 'Failed to create shop category.', ephemeral: true });
            }
        }

        try {
            var adminRoles = await getRoles(interaction.guild, { isAdmin: true });
            var ownerRole = await getRoles(interaction.guild, { name: "Owner" });
            var allRoles = await getRoles(interaction.guild, {});

            // Create a new text channel for item details input
            var createdChannel = await createChannel(
                interaction.guild,
                `item-details`,
                ChannelType.GuildText,
                shopCategory.id,
                [{
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                }]
            );

            adminRoles.forEach(async (role) => {
                createdChannel.permissionOverwrites.edit(role.id, {
                    ViewChannel: true,
                });
            });

            ownerRole.forEach(async (role) => {
                createdChannel.permissionOverwrites.edit(role.id, {
                    SendMessages: true,
                    ViewChannel: true,
                });
            });

            interaction.reply({ content: `Channel created, please fill in the information -> <#${createdChannel.id}>`, ephemeral: true });

            var tempMessage = await createdChannel.send("Enter items name: ");

            // Filter to only listen for messages in the newly created channel
            const filter = m => m.channelId === createdChannel.id && m.author.id === interaction.user.id;

            // Message collector to gather item details
            const collector = createdChannel.createMessageCollector({ filter, time: 300000, max: 5 }); // Adjust time and max as needed

            let itemDetails = {};

            collector.on('collect', async message => {
                if(!itemDetails.name){
                    itemDetails.name = message.content;
                    await tempMessage.delete();
                    await message.channel.send(`Name set to: ${itemDetails.name}`);
                    tempMessage = await message.channel.send(`Enter item price for basic user: `);
                } else if (!itemDetails.basicPrice) {
                    itemDetails.basicPrice = message.content;
                    await tempMessage.delete();
                    await message.channel.send(`Price for basic user set to: ${itemDetails.basicPrice}`);
                    tempMessage = await message.channel.send(`Enter item price or item reduction for VIP: `);
                } else if (!itemDetails.vipPrice) {
                    itemDetails.vipPrice = message.content;
                    await tempMessage.delete();
                    await message.channel.send(`Price or reduction for VIP set to: ${itemDetails.vipPrice}`);
                    tempMessage = await message.channel.send(`Enter item price or item reduction for Premium: `);
                } else if (!itemDetails.premiumPrice) {
                    itemDetails.premiumPrice = message.content;

                    // All details collected, ask for additional items
                    collector.stop('global_details_collected');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason !== 'global_details_collected') {
                    // Collector ended without collecting all global details
                    await interaction.channel.send({ content: 'Item creation canceled or timed out.', ephemeral: true });
                } else {
                    let addingMoreItems = true;
                    let itemList = "";

                    while (addingMoreItems) {
                        const itemNameMessage = await createdChannel.send("Enter additional item name or type 'done' to finish: ");
                        const itemNameResponse = await createdChannel.awaitMessages({
                            max: 1,
                            time: 60000, // Adjust timeout as needed
                            errors: ['time'],
                            filter: m => m.author.id === interaction.user.id,
                        });

                        const itemName = itemNameResponse.first().content;

                        if (itemName.toLowerCase() === 'done') {
                            addingMoreItems = false;
                            await itemNameMessage.delete();
                            await itemNameResponse.first().delete();
                            break;
                        }

                        await itemNameMessage.delete();
                        await itemNameResponse.first().delete();

                        // Add item to the list
                        itemList += `\`${itemName}\`: ${itemDetails.basicPrice}€ \n`;
                    }

                    const embed = new EmbedBuilder()
                        .setColor(`#008080`)
                        .setTitle(`${itemDetails.name}`)
                        .addFields(
                            { name: `${itemDetails.name}`, value: itemList },
                            { name: "VIP", value: itemDetails.vipPrice, inline: true},
                            { name: "Premium", value: itemDetails.premiumPrice, inline: true}

                        )
                        .setFooter({
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                        .setTimestamp();


                    var messageSize;
                    await createdChannel.messages.fetch().then((messages) =>{ 
                        messageSize = messages.size
                    })
                    await createdChannel.bulkDelete(messageSize)
                    await createdChannel.send({ embeds: [embed] });
                    await createdChannel.setName(`🛒・${itemDetails.name}`)

                    createdChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        ViewChannel: true,
                    });

                    await interaction.channel.send({ content: 'All items added successfully!', ephemeral: true });
                }
            });

        } catch (error) {
            console.error('Error creating item channel:', error);
            await interaction.reply({ content: 'Failed to create item channel.', ephemeral: true });
        }
    },
};

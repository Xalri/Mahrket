const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createChannel } = require('./auto');
const { Channels } = require('../../Schemas/discord-bot-schema.js');
const { getRoles } = require('../../utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-items')
        .setDescription('Add multiple items to the shop.')
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

        // Ensure the shop category exists, create it if not
        let shopCategory = guild.channels.cache.find(channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory);
        if (!shopCategory) {
            try {
                shopCategory = await interaction.guild.channels.create({name: categoryName, type: ChannelType.GuildCategory });
            } catch (error) {
                console.error('Error creating shop category:', error);
                return interaction.reply({ content: 'Failed to create shop category.', ephemeral: true });
            }
        }

        // Create a new text channel for item details input
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

        interaction.reply({ content: `Channel created, please fill in the information -> <#${createdChannel.id}>`, ephemeral: true });

        const itemDetails = {
            name: '',
            description: '',
            categories: []
        };

        const questions = [
            { key: 'name', prompt: 'Enter item name:', type: 'string', answer: "Item name set to : " },
            { key: 'description', prompt: 'Enter item description:', type: 'string', answer: "Item description set to : " }
        ];

        // Function to ask for pricing for each role type in a category
        const askRolePrices = async (categoryName) => {
            let tempMessage;
            tempMessage = await createdChannel.send(`Enter item price for "${categoryName}" (VIP):`);
            const vipPrice = await getPriceResponse();
            await tempMessage.delete()
            await createdChannel.send("Price for VIP set to " + vipPrice + "€")

            tempMessage = await createdChannel.send(`Enter item price for "${categoryName}" (Premium):`);
            const premiumPrice = await getPriceResponse();
            await tempMessage.delete()
            await createdChannel.send("Price for Premium set to " + premiumPrice + "€")
            
            tempMessage = await createdChannel.send(`Enter item price for "${categoryName}" (Basic User):`);
            const basicPrice = await getPriceResponse();
            await tempMessage.delete()
            await createdChannel.send("Price for Basic User set to " + basicPrice + "€")

            return { name: categoryName, vipPrice, premiumPrice, basicPrice };
        };

        // Function to get price response from user
        const getPriceResponse = async () => {
            const filter = (m) => m.author.id === interaction.user.id;
            const response = await createdChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });

            if (!response || response.size === 0) {
                await interaction.reply({ content: 'No response received. Item creation cancelled.', ephemeral: true });
                return null;
            }

            const priceInput = response.first().content;
            const price = parseFloat(priceInput);

            if (isNaN(price)) {
                await interaction.reply({ content: 'Invalid input. Please enter a valid number.', ephemeral: true });
                return null;
            }

            console.log("REPONSE : " + response.first(3))

            await response.first().delete();
            return price;
        };

        // Ask basic details
        const askQuestions = async () => {
            let tempMessage;
            for (const { key, prompt, type, answer } of questions) {
                
                tempMessage = await createdChannel.send(prompt);

                const filter = (m) => m.author.id === interaction.user.id;
                const response = await createdChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });

                if (!response || response.size === 0) {
                    await interaction.reply({ content: 'No response received. Item creation cancelled.', ephemeral: true });
                    return;
                }

                itemDetails[key] = response.first().content;
                await response.first().delete();

                await tempMessage.delete()
                await createdChannel.send(answer + response.first().content)




            }

            // Ask for categories and prices
            let continueAddingCategories = true;
        
            while (continueAddingCategories) {
                await createdChannel.send('‎');
                tempMessage = await createdChannel.send('Enter category name (e.g., 1 month, 3 months, etc.):');

                const filter = (m) => m.author.id === interaction.user.id;
                const response = await createdChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });



                if (!response || response.size === 0) {
                    await interaction.reply({ content: 'No response received. Item creation cancelled.', ephemeral: true });
                    return;
                }

                const categoryName = response.first().content;
                await tempMessage.delete()
                await response.first().delete();
                await createdChannel.send("category named " + categoryName + " created")

                const categoryPrices = await askRolePrices(categoryName);
                itemDetails.categories.push(categoryPrices);

                await createdChannel.send(`Category "${categoryName}" added with prices: VIP - ${categoryPrices.vipPrice}€, Premium - ${categoryPrices.premiumPrice}€, Basic - ${categoryPrices.basicPrice}€`);

                // Ask if user wants to add more categories
                tempMessage = await createdChannel.send('Do you want to add another category? (yes/no)');
                const confirmationResponse = await createdChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] });

                if (!confirmationResponse || confirmationResponse.size === 0) {
                    await interaction.reply({ content: 'No response received. Item creation cancelled.', ephemeral: true });
                    return;
                }

                const confirmation = confirmationResponse.first().content.toLowerCase();
                await tempMessage.delete()
                await confirmationResponse.first().delete()
                // await confirmationResponse.first(2)[1].delete();

                continueAddingCategories = confirmation === 'yes';
            }

            // Create embeds for each category
            var messageSize;
            await createdChannel.messages.fetch().then((messages) =>{ 
                messageSize = messages.size
                console.log(messages)
            })
            console.log(messageSize)
            await createdChannel.bulkDelete(messageSize)
            var embed = new EmbedBuilder()
                        .setColor('#008080')
                        .setTitle(itemDetails.name)
                        .setDescription(itemDetails.description)
            await createdChannel.send({ embeds: [embed] });
            for (const category of itemDetails.categories) {
                var embed = new EmbedBuilder()
                    .setColor('#008080')
                    .setTitle(category.name)
                    .addFields(
                        {name: 'Price', value: `\`VIP Price\` : ${category.vipPrice}€ \n\`Premium Price\` : ${category.premiumPrice}€ \n\`basic User Price\` : ${category.basicPrice}€`},
                    );

                await createdChannel.send({ embeds: [embed] });
            }

            await createdChannel.setName(`🛒・${itemDetails.name}`)
            await createdChannel.send("Buy -> <#" + Guild.tichannel + ">")
            createdChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ViewChannel: true,
            })

            // Optionally, finalize the item creation process
            // Example: Store all gathered information in MongoDB, send confirmation message, etc.
            // await interaction.reply({ content: 'Item added successfully!', ephemeral: true });

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
        };

        // Start asking questions and gathering category details
        await askQuestions();
    }
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the information about all commands')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to display')
                .setRequired(false)),
    async execute(interaction) {
        const botUser = interaction.client.user;
        const botOwner = interaction.client.application.owner;
        const option = interaction.options.getString('command')
        const member = interaction.member

        if(option){
            var name = ""

            const commandFolders = fs.readdirSync('./commands');
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
                for (const file of commandFiles) {
                    if((option + ".js").toString()  === file.toString()){
                        const command = require(`../${folder}/${file}`);
                        var commandFolder = `${folder}`
                        var name = command.data.name
                        var description = command.data.description
                    }
                    
                    
                }
                
            }





            const notFoundEmbed = new EmbedBuilder()
                    .setColor("#0000FF")
                    .setDescription("Command no find. Type /help to see all commands")
                    .setTitle('Bot Information')
                    .setThumbnail(botUser.displayAvatarURL())
                    .setFooter({ 
                        text: `Requested by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();


            



            if(commandFolder === "bot owner only" || name === ""){
                
                return await interaction.reply({embeds: [notFoundEmbed]})
            }else if(commandFolder === "owner"){
                if(!member.roles.cache.some(role => role.name === 'Owner')){
                    return await interaction.reply({embeds: [notFoundEmbed]})
                }
            }else if(commandFolder === "moderation"){
                if(!member.roles.cache.some(role => role.name === 'Moderator')){
                    return await interaction.reply({embeds: [notFoundEmbed]})
                }
            }
            const embed = new EmbedBuilder()
                .setColor("#0000FF")
                .addFields({name: commandFolder, value: `\`${name}\` : ${description || 'No description available'} \n`})
                .setTitle('Commands list')
                .setThumbnail(botUser.displayAvatarURL())
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            await interaction.reply({embeds: [embed]})
        }else{

            // Basic bot info
            const fields = [
                { name: 'Username', value: botUser.username, inline: true },
                { name: 'Discriminator', value: `#${botUser.discriminator}`, inline: true },
                { name: 'ID', value: botUser.id, inline: true },
                { name: 'Created At', value: botUser.createdAt.toDateString(), inline: true },
                { name: 'Owner', value: botOwner ? botOwner.tag : 'N/A', inline: true },
                { name: 'Guilds', value: interaction.client.guilds.cache.size.toString(), inline: true },
                { name: 'Users', value: interaction.client.users.cache.size.toString(), inline: true },
            ];
    
            // Adding command info
            const commandFolders = fs.readdirSync('./commands');
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
                let val = "";
                for (const file of commandFiles) {
                    const command = require(`../${folder}/${file}`);
                    val += `\`${command.data.name}\` : ${command.data.description || 'No description available'} \n`
                }
                if(folder === "owner"){
                    if(member.roles.cache.some(role => role.name === 'Owner')){
                        fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                    }
                }else if(folder === "moderation"){
                    if(member.roles.cache.some(role => role.name === 'Moderator')){
                        fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                    }
                }else if(folder !== "bot owner only"){ 
                    fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                }

                // if(folder === "owner" && member.roles.cache.some(role => role.name === 'Owner')){
                //     fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                // } else if(folder === "moderation" && member.roles.cache.some(role => role.name === 'Moderator')){
                //     fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                // } else if(folder !== "bot owner only"){ 
                //     fields.push({ name: `${folder}`, value: val, inline: false }); // Add folder name as a separator
                // }
                
                    
                
            }
    
            // Split fields into multiple embeds
            const embedFields = fields.reduce((acc, field, index) => {
                const chunkIndex = Math.floor(index / 25);
                if (!acc[chunkIndex]) acc[chunkIndex] = [];
                acc[chunkIndex].push(field);
                return acc;
            }, []);
    
            // Create embeds
            const embeds = embedFields.map((fieldsChunk, index) => {
                const embed = new EmbedBuilder()
                    .setColor("#0000FF")
                    .addFields(fieldsChunk)
                    .setFooter({ 
                        text: `Requested by ${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setTimestamp();
                    if(index === 0) {
                        embed.setTitle('Bot Information');
                    }
    
                    if (index === 0) { // Add general info only to the first embed
                        embed.setThumbnail(botUser.displayAvatarURL());
                    }
    
                return embed;
            });
    
            // Send the embeds
            await interaction.deferReply(); // Defer the reply to allow for more processing time if needed
            for (const embed of embeds) {
                await interaction.followUp({ embeds: [embed] });
            }
        }
        
    },
};

const config = require("../config")
const { Events, InteractionType, PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const { Channels } = require('../Schemas/discord-bot-schema.js')



const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

  }

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if(!interaction.guild) return;
		if(interaction.type === InteractionType.ApplicationCommand){
		
		
		
		

        
			let bypassCommandChannel = false

			let commandFile ;
			
			
			
			const foldersPath = path.join(path.join(__dirname, "../"), 'commands');
			const commandFolders = fs.readdirSync(foldersPath);

			let responseMessage = '';
			for(const option of interaction.options.data){
				if (option.type === 6) {
					try {
						const member = await interaction.guild.members.fetch(option.value);
						responseMessage += ` | ${option.name}: ${member.user.tag} (${member.displayName})`;
					} catch (error) {
						console.error(`Error fetching user with value ${option.value}:`, error);
						responseMessage += ` | ${option.name}: Error fetching user`;
					}
				} else {
					responseMessage += ` | ${option.name}: ${option.value}`;
				}				
			};
			
			for (const folder of commandFolders) {
				const commandsPath = path.join(foldersPath, folder);  
				const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					if((interaction.commandName + ".js").toString()  === file.toString()){
						commandFile = require(`../commands/${folder}/${file}`)
						if(folder.toString() === "moderation"){
							bypassCommandChannel = true
							if (!interaction.member.roles.cache.some(role => role.name === 'Moderator')) {
								
								process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
								console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);
		
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
						}else if(folder.toString() === "owner"){
							bypassCommandChannel = true
							if (!interaction.member.roles.cache.some(role => role.name === 'Owner')) {
								
								process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
								console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);
		
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
							
						
						}else if(folder.toString() === "bot owner only"){
							bypassCommandChannel = true
							if (interaction.user.tag !== 'xalri') {
								
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
							
						
						}
						
					}
					
				}
			}
			
			commandinfo = commandFile.info ? commandFile.info : {channel : "command"}


			
			
			
			
			
			
			process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
			console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			const channels = await Channels.findOne({ guild_id: interaction.guild.id }) ? await Channels.findOne({ guild_id: interaction.guild.id }) : 0

			if(channels === 0){
				return execute_command(command, interaction, responseMessage)
			}


			switch(commandinfo.channel){
				case "command":
					
					
					const cchannel = channels.cchannel
					

					if(cchannel !== "" ){ 
						if(interaction.channel.id != cchannel && bypassCommandChannel !== true){
							interaction.reply({content: `Veuillez utiliser les commandes dans le channels command -> <#${cchannel}>`, ephemeral: true})
						}else{
							execute_command(command, interaction, responseMessage)
						}
					}else{
						execute_command(command, interaction, responseMessage)
					}
					break;



				case "media":

					
					const mechannel = channels.mechannel
					
					
					if(mechannel !== "" ){ 
						if(interaction.channel.id != mechannel && bypassCommandChannel !== true){
							interaction.reply({content: `Veuillez utiliser les commandes dans le channels command -> <#${mechannel}>`, ephemeral: true})
						}else{
							execute_command(command, interaction, responseMessage)

						}
					}else{
						execute_command(command, interaction, responseMessage)

					}
					break;
				
				

				case "all":
					execute_command(command, interaction, responseMessage)
					break;
			
			}
		}else if(interaction.isButton()){
			const { customId } = interaction;
			const type = customId.split('-')[1];
			const userId = interaction.user.id

			if (customId.startsWith('ticket-')) {
				let Category = await interaction.guild.channels.cache.find(c => c.name === "TICKETS🎫" && c.type === ChannelType.GuildCategory)
				console.log(Category)
				if(!Category){
					Category = await interaction.guild.channels.create({
						name: "TICKETS🎫",
					
						type: ChannelType.GuildCategory, 

						permissionOverwrites : [{
							id: interaction.guild.roles.everyone,

							deny: [PermissionFlagsBits.ViewChannel]
						}]
					})
				}

				const ticketChannel = await interaction.guild.channels.create({
					name: `ticket-${type.charAt(0)}-${interaction.user.username}`,
					type: ChannelType.GuildText,
					parent: `${Category.id}`,
					permissionOverwrites: [
						{
							id: interaction.guild.roles.everyone.id,
							deny: [PermissionFlagsBits.ViewChannel],
						},
						{
							id: userId,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
						},
						{
							id: `${interaction.guild.roles.cache.find(role => role.name === "Muted").id}`, // Replace with your support role ID
							deny: [PermissionFlagsBits.ViewChannel],
						},
					],
					parent: interaction.channel.parentId
				});

				

				const closeButton = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close_ticket')
						.setLabel('Close Ticket')
						.setStyle(ButtonStyle.Danger)
				);
	
				await ticketChannel.send({
					content: `<@${userId}>`,
					embeds: [new EmbedBuilder().setColor('#0099ff').setTitle('Support Ticket').setDescription(`Ticket Type: ${type}`)],
					components: [closeButton],
				});
	
				await interaction.reply({ content: `Your ticket has been created: <#${ticketChannel.id}>`, ephemeral: true });
			}  else if (customId === 'close_ticket') {
				// Replace close ticket button with confirmation buttons
				const confirmationRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('confirm_close')
						.setLabel('Yes')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId('cancel_close')
						.setLabel('No')
						.setStyle(ButtonStyle.Danger)
				);
	
				const confirmationEmbed = new EmbedBuilder()
					.setColor('#ff0000')
					.setTitle('Confirm Close Ticket')
					.setDescription('Are you sure you want to close this ticket?');
	
				await interaction.update({
					content: ' ',
					embeds: [confirmationEmbed],
					components: [confirmationRow],
				});
			} else if (customId === 'confirm_close') {
				await interaction.channel.delete();
			} else if (customId === 'cancel_close') {
				// Remove confirmation buttons and revert to original state
				const closeButton = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close_ticket')
						.setLabel('Close Ticket')
						.setStyle(ButtonStyle.Danger)
				);
	
				const originalEmbed = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('Support Ticket')
					.setDescription(`Ticket Type: ${type}`);
	
				await interaction.update({
					content: `<@${userId}>`,
					embeds: [originalEmbed],
					components: [closeButton],
				});
			}else if(customId === 'poll'){
				const modal = new ModalBuilder()
					.setCustomId('myModal')
					.setTitle('My Modal');

				// Add components to modal

				// Create the text input components
				const answer = new TextInputBuilder()
					.setCustomId('answer')
					// The label is the prompt the user sees for this input
					.setLabel("Answer :")
					// Short means only a single line of text
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setPlaceholder('Write your answer here !')


				// An action row only holds one text input,
				// so you need one action row per text input.
				const firstActionRow = new ActionRowBuilder().addComponents(answer);

				// Add inputs to the modal
				modal.addComponents(firstActionRow);

				await interaction.showModal(modal)
			}

		}else if(interaction.isModalSubmit()){
			if (interaction.customId === 'myModal') {
				if(global.pollAnswers.filter(answer => answer.author === interaction.user.tag).length === 3){
					await interaction.reply({ content: 'You can\'t add more than 3 answer per poll ', ephemeral: true });
				}
				global.pollAnswers.push({answer: interaction.fields.getTextInputValue('answer'), author: interaction.user.tag})
				await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
			}
		}
		
		
		
		
		
		
		
		
	},
};




async function execute_command(command, interaction, responseMessage){
	try {
    			
		if(responseMessage === undefined){responseMessage = "";}
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}
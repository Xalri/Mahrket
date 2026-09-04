const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const { Channels } = require('../../Schemas/discord-bot-schema.js')



module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear_server')
		.setDescription('clears the entire server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		const ConfirmEmbed = new EmbedBuilder()
                .setDescription(' Are you sure you want to clear the server!?')
                .setColor('#FF0000')


            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('backup-yes-create')
                )
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('backup-no-create')
                );

            interaction.reply({
                embeds: [ConfirmEmbed],
                components: [row],
                ephemeral: true
            })
            
            const filter = i => i.user.id === interaction.user.id;
            

            const collector = await interaction.channel.createMessageComponentCollector({
                filter,
                time: 15000,
            })

            collector.on("collect", async (i) => {
				if (i.customId === "backup-yes-create") {

                    interaction.guild.channels.fetch().then(channels => channels.forEach(channel => channel.delete()))
					await interaction.guild.channels.create({ 

						name: "general",
		
						type: ChannelType.GuildText, 
		
						permissionOverwrites: [{ // same as before

							id: interaction.guild.id,
		
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
		
						}]
		
					});
                    const guild_id = interaction.guild.id
					const channelDoc = await Channels.findOne({ guild_id });
					channelDoc.cchannel = "";
					channelDoc.wechannel = "";
					channelDoc.gochannel = "";
					channelDoc.gechannel = "";
                    channelDoc.mechannel = "";
                    channelDoc.aichannel = "";

                    channelDoc.save()

                } else if (i.customId === "backup-no-create") {

                    
                    
                    const ConfirmEmbed2 = new EmbedBuilder()
                        .setDescription(' Are you sure you want to clear the server!?')
                        .setColor('#FF0000')


                    const row2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel('Yes')
                            .setStyle(ButtonStyle.Success)
                            .setCustomId('backup-yes-create')
                            .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel('No')
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId('backup-no-create')
                            .setDisabled(true)
                        );
                    
                    const NoEmbed = new EmbedBuilder()
                    
                        .setDescription(`Cancelled The action!`)
                        .setColor('#FF0000')

                    i.update({
                        embeds: [NoEmbed],
						components: [row2],
                        ephemeral: true
                    })
                }
        		
			})
	},
};
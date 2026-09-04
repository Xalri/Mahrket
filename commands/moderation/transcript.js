const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChannelType} = require('discord.js')
const { createTranscript } = require('discord-html-transcripts')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcript')
		.setDescription('Trasncript the specified channel')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to trasncript').addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText, ChannelType.AnnouncementThread).setRequired(true))
        .addIntegerOption(option => option.setName('limit').setDescription('The limit of trasncripted messages').setRequired(true).setMinValue(1).setMaxValue(10000))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
		if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({content: "You don't have permissions to use this command", ephemeral: true})

        let channel = interaction.options.getChannel('channel')
        let limit = interaction.options.getInteger('limit')

        await interaction.reply({content: "Your trasncript is being loaded, please wait a few minutes", ephemeral: true})

        const file = await createTranscript(channel, {
            limit: limit,
            returnBuffer: false,
            filename: `${channel.name.toLowerCase()}-trasncript.html`
        })


        let cache = interaction.channel
        let msg = await cache.send({files: [file]})

        

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Open')
            .setURL(`https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`)
            .setStyle(ButtonStyle.Link),

            new ButtonBuilder()
            .setLabel('Download')
            .setURL(`${msg.attachments.first()?.url}`)
            .setStyle(ButtonStyle.Link)
        )

        const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`📦Your **transcript** for ${channel} is ready with a limit of \`${limit}\``)

        await interaction.editReply({embeds: [embed], components: [button], content: '', ephemeral: true})
	},
};



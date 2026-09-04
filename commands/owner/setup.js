const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const { Channels, Counting } = require('../../Schemas/discord-bot-schema.js')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup channels for your bot.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('command')
                .setDescription('Set the command channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The command channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('general')
                .setDescription('Set the general channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The general channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('goodbye')
                .setDescription('Set the goodbye channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The goodbye channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('Set the welcome channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The welcome channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ai')
                .setDescription('Set the AI channel')
                .addChannelOption(option => option.setName('channel').setDescription('The AI channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Display the information about the setup process')
                .addChannelOption(option => option.setName('channel').setDescription('The info channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('media')
                .setDescription('Set the media channel')
                .addChannelOption(option => option.setName('channel').setDescription('The media channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('captcha')
                .setDescription('Set the captcha channel')
                .addChannelOption(option => option.setName('channel').setDescription('The captcha channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reports')
                .setDescription('Set the reports channel')
                .addChannelOption(option => option.setName('channel').setDescription('The reports channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('logs')
                .setDescription('Set the logs channel')
                .addChannelOption(option => option.setName('channel').setDescription('The logs channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket')
                .setDescription('Set the ticket channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The ticket channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('counting')
                .setDescription('Set the counting channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The counting channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('announcement')
                .setDescription('Set the announcement channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The announcement channel').setRequired(false))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'command' || subcommand === 'general' || subcommand === 'goodbye' || subcommand === 'welcome' || subcommand === 'ai' || subcommand === 'media' || subcommand === 'captcha' || subcommand === 'ticket' || subcommand === 'reports' || subcommand === 'logs' || subcommand === 'counting' || subcommand === 'announcement') {
            const guild_id = interaction.guild.id;
            const db = await Channels.findOne({ guild_id })
            const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel').id : interaction.channel;


            switch(subcommand) {
                //########################### COMMAND
                case 'command':
                    channel_name = "cchannel";
                    break;
                //########################### GENERAL
                case 'general':
                    channel_name = "gechannel";
                    break;
                //########################### GOODBYE
                case 'goodbye':
                    channel_name = "gochannel";
                    break;
                //########################### WELCOME
                case 'welcome':
                    channel_name = "wechannel";
                    break;
                //########################### AI
                case 'ai':
                    channel_name = "aichannel";
                    break;
                //########################### MEDIA
                case 'media':
                    channel_name = "mechannel";
                    break;
                //########################### LOGS
                case "logs":
                    channel_name = "lochannel";
                    break;
                //########################### COUNTING
                case "counting":
                    channel_name = "cochannel";
                    const counting = await Counting.findOne({ Guild: interaction.guild.id});
                    
                    const co_channel = channel
    
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
                    break;
                //########################### COUNTING
                case "announcement":
                    channel_name = "anchannel";
                    break;
                //########################### CAPTCHA
                case 'captcha':
                    channel_name = "cachannel"
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        ViewChannel: false
                    })
                    break;


                //########################### TICKET
                case 'ticket':            
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

                    await interaction.reply({ content: `Channel ${channel} has been locked and the ticket embed has been sent.`, ephemeral: true });

                    channel_name = "tichannel"
                    break;
                
                //########################### REPORTS
                case "reports":
                    channel_name = "rechannel"
                    break;
            }
            

           

            // Replace with your database logic to store the channel ID
            db[channel_name] = channel.id;
            await db.save()

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `Successfully set ${subcommand} channel to <#${channel.id}>.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `Successfully set ${subcommand} channel to <#${channel.id}>.`, ephemeral: true });
            }
        }else if (subcommand === 'info'){
            await interaction.reply({content: "Starting setup for server\nDo you want to configure command channel and welcome channel yourself?\nTo automatically configure the channels, type \`/auto\`\nTo manually configure the channels, go in the desire channel and type \`/setup {command|general|etc..}\`", ephemeral: true})
        
        }
    },

    info: {channel: "all"}
};

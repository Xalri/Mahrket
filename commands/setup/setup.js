const { SlashCommandBuilder } = require('discord.js');
const { Channels } = require('../../Schemas/discord-bot-schema.js')



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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Display the information about the setup process')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'command' || subcommand === 'general' || subcommand === 'goodbye' || subcommand === 'welcome' || subcommand === 'ai') {
            const guild_id = interaction.guild.id;
            const db = await Channels.findOne({ guild_id })
            switch(subcommand) {
                case 'command':
                    channel_name = "cchannel";
                    break;
                case 'general':
                    channel_name = "gechannel";
                    break;
                case 'goodbye':
                    channel_name = "gochannel";
                    break;
                case 'welcome':
                    channel_name = "wchannel";
                    break;
                case 'ai':
                    channel_name = "aichannel";
                    break;
            }
            const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel').id : interaction.channel.id;

           

            // Replace with your database logic to store the channel ID
            console.log("db : " + db)
            console.log("db[] : " + db[channel_name])
            db[channel_name] = channel;
            await db.save()

            await interaction.reply({ content: `Successfully set ${subcommand} channel to <#${channel}>.`, ephemeral: true });
        }else if (subcommand === 'info'){
            await interaction.reply("Starting setup for server\nDo you want to configure command channel and welcome channel yourself?\nTo automatically configure the channels, type '/auto'\nTo manually configure the channels, go in the desire channel and type /setup ")
        
        }
    },
};

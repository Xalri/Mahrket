const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const backup = require("discord-backup")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Server Backup!')
        .addSubcommand(option =>
            option.setName('create')
                .setDescription('Create Backup'))
        .addSubcommand(option =>
            option.setName('info')
                .setDescription('Get a Info About a Backup Id')
                .addStringOption(option => option.setName('backup-id').setDescription('The backup id you want info about').setRequired(true)))
        .addSubcommand(option =>
            option.setName('load')
                .setDescription('Load your Backup')
                .addStringOption(option => option.setName('backup-id').setDescription('The backup id you want info about').setRequired(true)))
        .addSubcommand(option =>
            option.setName('delete')
                .setDescription('Delete a Backup')
                .addStringOption(option => option.setName('backup-id').setDescription('The backup id you want info about').setRequired(true)))
        .addSubcommand(option =>
            option.setName('list')
                .setDescription('List all backups for the guild')),
    async execute( interaction) {
        const SubCommand = interaction.options.getSubcommand();
        console.log(SubCommand)

        if (SubCommand === "create") {
            console.log("CREATE SUBCOMMAND")
            const ConfirmEmbed = new EmbedBuilder()
                .setDescription(' Are you sure you want to create a backup!?')
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
                console.log("COLLECT COLLECTOR")
                console.log("INTERACTION: " + interaction)

                if (i.customId === "backup-yes-create") {

                    //if (i.user.id !== interaction.user.id) return i.reply({
                     //   content: "Don't touch other people's button",
                    //    ephemeral: true
                    //})

                    //i.deferReply()
                    const ConfirmEmbed1 = new EmbedBuilder()
                        .setDescription(' Are you sure you want to create a backup!?')
                        .setColor('#FF0000')


                    const row1 = new ActionRowBuilder()
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
                    i.update({
                        embeds: [ConfirmEmbed1],
                        components: [row1],
                        ephemeral: true
                    })

                    backup.create(interaction.guild, {
                        jsonBeautify: true,
                        saveImages: "base64",
                        maxMessagesPerChannel: 5,
                    }).then((backupData) => {
                        let guildicon = interaction.guild.iconURL({
                            dynamic: true
                        });
                        const auth = i.user.tag
                        const AvatarUrl = i.user.displayAvatarURL()
                        let datacreated = new EmbedBuilder()
                            .setAuthor({name: auth, iconURL: AvatarUrl})
                            .setDescription(`New Backup Created\n> **Backup ID**: \`${backupData.id}\`\n> **Guild Name**: ${interaction.guild.name}`)

                            .setColor('#FF0000')
                        i.user.send({
                            embeds: [datacreated]
                        });
                        let created = new EmbedBuilder()
                            .setAuthor({name: auth, iconURL: AvatarUrl})
                            .setDescription(`Backup Has Been Created, Check your dms!`)
                            .setColor('#FF0000')


                        i.followUp({
                            embeds: [created],
                            ephemeral: true
                        });
                    });

                } else if (i.customId === "backup-no-create") {

                    
                    
                    const ConfirmEmbed2 = new EmbedBuilder()
                        .setDescription(' Are you sure you want to create a backup!?')
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
                        .setDescription(`Cancelled The Backup!`)
                        .setColor('#FF0000')

                    i.update({
                        embeds: [NoEmbed],
                        ephemeral: true
                    })
                }
            })


        } else if (SubCommand === "info") {
            let backupID = interaction.options.getString("backup-id");
            if (!backupID) {
                let notvaild = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`> You must specify a valid backup ID `)

                    .setColor('#FF0000')

                return interaction.reply({
                    embeds: [notvaild],
                    ephemeral: true
                });
            }
            backup.fetch(backupID).then((backupInfos) => {
                const date = new Date(backupInfos.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(),
                    mm = (date.getMonth() + 1).toString(),
                    dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;
                let backups = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor('#FF0000')

                    .setDescription(`**Back Up Info**\n> Backup ID: ${backupInfos.id} \n> Server ID: ${backupInfos.data.guildID} \n> Backup Size: ${backupInfos.size} mb \n> Backup Created At: ${formatedDate}`)

                interaction.reply({
                    embeds: [backups],
                    ephemeral: true
                })
            }).catch((err) => {
                let nobackupfound = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`> No Backup Found For: \`${backupID}\`!`)

                    .setColor('#FF0000')
                interaction.reply({
                    embeds: [nobackupfound],
                    ephemeral: true
                })
            });

        } else if (SubCommand === "load") {
            // =====================================================================================
            const backupID = interaction.options.getString('backup-id')
            backup.fetch(backupID).then(async () => {

                const eConfirmEmbed = new EmbedBuilder()
                    .setDescription(' Are you sure you want to load the back!?\nThis will delete all channels, roles, messages, emojis, bans etc.\nNONE OF THE MEMBERS WILL BE KICKED!')
                    .setColor('#FF0000')


                const erow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('backup-yes-load')
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel('No')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('backup-no-load')
                    );

                interaction.reply({
                    embeds: [eConfirmEmbed],
                    components: [erow],
                    ephemeral: true
                })
                
                const filter = i => i.user.id === interaction.user.id

                const collector = await interaction.channel.createMessageComponentCollector({
                    filter,
                    time: 15000
                })

                collector.on("collect", async (i) => {

                    if (i.customId === "backup-yes-load"){

                        
                        backup.load(backupID, interaction.guild, {
                            clearGuildBeforeRestore: true
                        }).then(() => {}).catch((err) => {
                            let permissionserorr = new EmbedBuilder()
                                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                                .setDescription(`There are 2 possible reasons for this message:\n> 1. I dont have ADMINISTRATOR Permissions\n> 2. I have completed the backup successfully!\n\nIf it is none of them please report this!`)

                                .setColor('#FF0000')

                            i.user.send({
                                embeds: [permissionserorr]
                            })
                        });

                    } else if (i.customId === "backup-no-load") {

                        
                        const ConfirmEmbed2 = new EmbedBuilder()
                            .setDescription(' Are you sure you want to create a backup!?')
                            .setColor('#FF0000')


                        const row2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel('Yes')
                                .setStyle(ButtonStyle.Success)
                                .setCustomId('backup-no-load')
                                .setDisabled(true)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel('No')
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId('backup-yes-load')
                                .setDisabled(true)
                            );
                        
                        const NoEmbed = new EmbedBuilder()
                            .setDescription(`Cancelled The Backup!`)
                            .setColor('#FF0000')

                        i.update({
                            embeds: [NoEmbed],
                            ephemeral: true
                        })
                    }
                })
            }).catch((err) => {
                let nobackupfound = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`No backup found for ${backupID}`)

                    .setColor('#FF0000')

                i.followUp({
                    embeds: [nobackupfound],
                    ephemeral: true
                })
            });



        } else if (SubCommand === "delete") {
            let backupID = interaction.options.getString("backup-id");
            if (!backupID) {
                let notvaild = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`You must specify a valid backup ID To Remove`)

                    .setColor('#FF0000')

                return interaction.reply({
                    embeds: [notvaild],
                    ephemeral: true
                })
            }
            backup.fetch(backupID).then((backupInfos) => {
                backup.remove(backupID)
                let backups = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`Backup Deleted!`)

                    .setColor('#FF0000')

                interaction.reply({
                    embeds: [backups],
                    ephemeral: true
                })
            }).catch((err) => {
                let nobackupfound = new EmbedBuilder()
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setDescription(`No backup found!`)

                    .setColor('#FF0000')
                interaction.reply({
                    embeds: [nobackupfound],
                    ephemeral: true
                })
            });

        } else if (SubCommand === "list") {

            await interaction.deferReply({ephemeral: true})

            let embeds = []
                
            backup.list().then(async (backups) => { 

                console.log(backups.length)


                if(backups.length === 0) {
                    console.log("no backups")
                    let embed1 = new EmbedBuilder()
                            .setAuthor({name: interaction.user.username, iconURL: interaction.user.AvatarUrl})
                            .setTitle("No backups exist")
                            .setColor('#FF0000')
                    interaction.editReply({
                        embeds: [embed1], 
                        ephemeral: true
                    })
                    return;
                }


                backups.forEach(backupID => {
                    backup.fetch(backupID).then(async (backupinfo) => {
                        console.log("fetching works : " + backupinfo.id)
                        // If the backup exists, request for confirmation
                            
                        let embed = new EmbedBuilder()
                            .setAuthor({name: interaction.user.username, iconURL: interaction.user.AvatarUrl})
                            .setTitle("Backup List")
                            .setColor('#FF0000')
                            .addFields(
                                {name: "Backup ID", value: backupinfo.id, inline: true},
                                {name: "Server ID", value: backupinfo.data.guildID, inline: true},
                                {name: "Backup Size", value: backupinfo.size + " MB", inline: true},
                                {name: "Created At", value: new Date(backupinfo.data.createdTimestamp).toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"}), inline: true}
                            )
                        embeds.push(embed);
                        
                    }).then(async () => {
                        console.log(embeds)


                        await interaction.editReply({embeds: embeds, ephemeral: true})
                    }).catch((err) => {
                        console.log(err);
                        // if the backup wasn't found
                        return interaction.editReply(":x: | No backup found for `"+backupID+"`!");
                    });
                    
                })


                


        
            });
        }
    }
}
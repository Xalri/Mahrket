const { SlashCommandBuilder } = require('@discordjs/builders');
const {  EmbedBuilder } = require('discord.js');

// Mapping of badge names to icons (example icons, replace with actual URLs)
const badgeIcons = {
    Staff: { url: '1263168783657467905', name: 'OfficialStaff' },
    Partner: { url: '1263168860618494073', name: 'partner' },
    CertifiedModerator: { url: '1263168946886938719', name: 'officialModerator' },
    Hypesquad: { url: '1263171240525430838', name: 'hypesquad' },
    HypeSquadOnlineHouse1: { url: '1263170802073735219', name: 'Icon_Hypesquad_Bravery' },
    HypeSquadOnlineHouse2: { url: '1263170988208689333', name: 'Icon_Hypesquad_Brillance' },
    HypeSquadOnlineHouse3: { url: '1263170803973754910', name: 'Icon_Hypesquad_Balance' },
    BugHunterLevel1: { url: '1263171311891382394', name: 'bughunter' },
    BugHunterLevel2: { url: '1263171672408854642', name: 'bughunter2' },
    ActiveDeveloper: { url: '1263171750359994501', name: 'activeDev' },
    PremiumEarlySupporter: { url: '1263171917842485288', name: 'EarlySupporter' },
    VerifiedDeveloper: { url: '1263171860548554764', name: 'devloppeurBotCertif' }
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-badge')
        .setDescription('Displays Discord badges and their counts for all server members.'),

    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const members = await guild.members.fetch(); // Fetch all members in the guild

            // Object to store badge counts
            let badges = [];
            let counts = {}



            members.forEach((member) => {
                badges = badges.concat(member.user.flags?.toArray())
            })

            console.log(badges)

            badges.forEach((badge) => {
                if(counts[badge]){
                    counts[badge]++;
                }else{
                    counts[badge] = 1;
                }
            })


            // Prepare the embed to display badge information
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Discord Badges - Server Members')

            let description = ""

            console.log(counts)

            for (let i = 0; i < Object.keys(badgeIcons).length; i++) {
                const name = Object.keys(badgeIcons)[i]
                const value = Object.values(badgeIcons)[i]
                description += `<:${value.name}:${value.url}> : ${counts[name] || 0} \n`    
            }

            embed.setDescription(description)

            

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching server badges:', error);
            await interaction.reply({ content: 'Failed to fetch server badges.', ephemeral: true });
        }
    },
};

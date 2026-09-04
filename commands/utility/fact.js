const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Fetches a random interesting fact')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language of the fact {en|fr|de|es|...}')
                .addChoices(
                    {name: 'English', value: 'en'},
                    {name: 'German', value: 'de'}
                )
                .setRequired(false)
        ),
    async execute(interaction) {
        const language = interaction.options.getString('language') ? interaction.options.getString('language') : "en";
        let fact = await fetchFact(language);


        

        if (fact) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Fact')
                .setDescription(fact)
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: 'Failed to fetch a random fact.', ephemeral: true });
        }
    },
};

async function fetchFact(language) {
    console.log(language)
    const endpoint = `https://uselessfacts.jsph.pl/api/v2/facts/random?language=${language}`;
    console.log(endpoint)
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch fact: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Error fetching fact:', error);
        return null;
    }
}


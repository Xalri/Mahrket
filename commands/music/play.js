const { SlashCommandBuilder } = require('@discordjs/builders');
const { useMainPlayer } = require('discord-player');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, NoSubscriberBehavior  } = require('@discordjs/voice');
const fs = require('fs');
const { generateDependencyReport } = require('@discordjs/voice');
const { Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play audio in your voice channel')
        .addStringOption(option => option.setName('song').setDescription('The song to play').setRequired(true))
        ,
    async execute(interaction) {

        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        const query = interaction.options.getString('song', true); // we need input/query to play
    
        // let's defer the interaction as things can take time to process
        await interaction.deferReply();
    
        const queue = player.createQueue(interaction.guild, {metadata: {Message: interaction.user}})

        const track = await player.search(query, {requestBy: interaction.user}).then(x => x.tracks[0])
        if(!track) return  interaction.reply("aucune musique trouvée")

        if(!queue.connection) await queue.connect(channel)
        await queue.play(track)
        interaction.followUp("musique a été ajouté")

    },
};

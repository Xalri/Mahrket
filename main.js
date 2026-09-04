const packageJSON = require("./package.json");
const {exec } = require('child_process');
const axios = require('axios');
const os = require('os');
// Function to get dynamic bot info
function getBotInfo() {
    const uptime = bot.uptime;
    const guilds = bot.guilds.cache.size;
    const users = bot.users.cache.size;
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const totalMemory = process.memoryUsage().heapUsed / (1024 * 1024);
    const cpuLoad = os.loadavg()[0];
    bot.application.commands.fetch()
    const commands = bot.application.commands.cache.size;
    const errors = 0; // Replace with actual error tracking if available

    return {
        uptime: `${Math.floor(uptime / (1000 * 60 * 60))} hours, ${Math.floor((uptime / (1000 * 60)) % 60)} minutes`,
        guilds,
        users,
        commands,
        memoryUsage,
        cpuLoad,
        totalMemory
    };
}

// Function to send bot info to local server
async function sendBotInfo() {
    
    function formatUptime(uptime) {
        const seconds = Math.floor((uptime / 1000) % 60);
        const minutes = Math.floor((uptime / (1000 * 60)) % 60);
        const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
    try {
        const uptime = formatUptime(bot.uptime)
        const guilds = bot.guilds.cache.size;
        const users = bot.users.cache.size;
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        const cpuLoad = os.loadavg()[0];
        bot.application.commands.fetch()
        const commands = bot.application.commands.cache.size;
        const errors = 0; // Replace with actual error tracking if available
    
        const botInfo = {
            uptime,
            guilds,
            users,
            commands,
            memoryUsage,
            cpuLoad,
            totalMemory
        };
        // const response = await axios.post(config.botInfoUrl, botInfo, {
            // headers: {
            //     'Content-Type': 'application/json'
            // }
        // });
        // console.log('Bot info sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending bot info:', error);
    }
}

// Set an interval to send bot info every 5 minutes
// setInterval(sendBotInfo, 5 * 1000); // 5 minutes
const discordJSVersion = packageJSON.dependencies["discord.js"];
console.log(discordJSVersion);
const Discord = require("discord.js");
const bot = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((a)=>{
        return Discord.GatewayIntentBits[a]
      }),
    shards: [0],
    shardCount: 1,
    autoFetch: [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
    ],
    partials: [
        Discord.Partials.Reaction,
        Discord.Partials.Message,
        Discord.Partials.Channel,
    ]
    
});
// const player = new Player(bot, {
//     ytdlOptions: {
//         filter: "audioonly",
//         quality: "highestaudio",
//         highWaterMark: 1 << 25
//     }
// });
// (async () =>{
//         // await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');
//         await player.extractors.loadDefault();
//     })
// const originalEmit = bot.rest.emit;

// bot.rest.emit = function (event, ...args) {
//     // Log the event and its arguments
//     console.log(`Event: ${event}`, args);

//     // Call the original emit method
//     return originalEmit.apply(bot.rest, [event, ...args]);
// };
function writeResponseToFile(response) {
    const filePath = 'responses.log';
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(response)}\n`;

    fs.appendFile(filePath, logEntry, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Response logged to file.');
        }
    });
}
// bot.rest.on("response", console.log)
// bot.on("all", console.log)
const config = require("./config");
const fs = require('node:fs');
setTimeout(() => {}, 5000)
const load_commands = require("./loaders/load_commands.js");
const load_event = require("./loaders/load_events.js");
const deploy_commands = require("./deploy_commands.js");
global.pollAnswers = []




// db.connect(function(err) {
//   if (err) {
//     console.error('Error connecting to the database:');
//     console.error('Host:', db.config.host);
//     console.error('User:', db.config.user);
//     console.error('Database:', db.config.database);
//     console.error('Error code:', err.code);
//     console.error('Error errno:', err.errno);
//     console.error('Error syscall:', err.syscall);
//     console.error('Error message:', err.message);
//     return;
//   }
//   console.log("Connected to the database!");
//   console.log("")
//   global.db = db
//   db.query("SELECT * FROM `guilds`", function (err, result) {
//     if (err) throw err;
//     console.log("List of all guild: " + JSON.stringify(result));
//     console.log(" ")
//   });
// });







bot.commands = new Discord.Collection();
bot.color = "#000000";




load_commands(bot);
// console.log(bot.commands)
load_event(bot);


const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await bot.destroy();
    console.log('Bot has shut down.');
    process.exit(0);
};


process.on('exit', shutdown); // Catches Ctrl+C event
// process.on('SIGTERM', shutdown); // Catches kill commands
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    shutdown();
});



module.exports = { bot }

    



// bot.function = {
//     createId: require("./fonctions/createId"),
// }
bot.on('error', console.log)


bot.login(config.token);




// while(typeof(command_channel) !== "string" && typeof(welcome_channel) !== "string"){
//     continue
// }

// console.log("channels ok")

const path = require('node:path');
const config = require("../config")
const fs = require('node:fs');

function load_event(bot){
    const eventsPath = path.join(path.join(__dirname, "../"), 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            bot.once(event.name, (...args) => event.execute(...args));
            console.log(`Event ${event.name} added ONCE`)
        } else {
            bot.on(event.name, (...args) => event.execute(...args));
            console.log(`Event ${event.name} added `)
        }
    }
    console.log(" ")
}

module.exports = load_event;
const { Schema, model } = require('mongoose')




//######################################## GUILD SCHEMA
//############# ROLES SCHEMA
let roleSchema = new Schema({
    name: {type: String},
    id: {type: String},
    isAdmin: {type: Boolean},

});

//############# GUILD SCHEMA
let guildSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    roles: [roleSchema]
  });




//######################################## CHANNELS SCHEMA
let channelsSchema = new Schema({
    guild_id: { type: String, required: true, unique: true },
    cchannel: { type: String, default: ""}, // command
    gechannel: { type: String, default: ""},//general
    wechannel: { type: String, default: ""},//welcome
    gochannel: { type: String, default: ""},//goodbye
    aichannel: { type: String, default: ""},//ai
    mechannel: { type: String, default: ""},//media
    cachannel: { type: String, default: ""},//captcha
    tichannel: { type: String, default: ""},//ticket
    rechannel: { type: String, default: ""},//reports
    lochannel: { type: String, default: ""},//logs
    cochannel: { type: String, default: ""},//counting
    anchannel: { type: String, default: ""},//announcement

});

//######################################## USERS SCHEMA
//############# REMINDERS SCHEMA
let reminderSchema = new Schema({
    id: {type: String},
    time: {type: String},
    message: {type: String},
});
//############# WARNS SCHEMA
let warnSchema = new Schema({
    target: {type: String},
    author: {type: String},
    reason: {type: String},
    sanction: {type: String},

});
//############# USERS SCHEMA
let usersSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    warnings: [warnSchema],
    reminders: [reminderSchema],
    ai: { type: Number, default: 5 },
});


let modSchema = new Schema({
    guildId: String,
    user: String,
})


//######################################## COUNTING SCHEMA
let countingSchema = new Schema({
    Guild: String,
    Channel: String,
    Number: Number,
    LastUser: String,
})



module.exports = {
    Guilds: model('Guilds', guildSchema),
    Channels: model('Channels', channelsSchema),
    Users: model("Users", usersSchema),
    Reminders: model("Reminders", reminderSchema),
    Mod: model("Mod", modSchema),
    Counting: model('Counting', countingSchema)
}
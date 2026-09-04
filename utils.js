const Canvas = require('canvas')
const { Guilds } = require('./Schemas/discord-bot-schema')

function randchoice(choices){
    let index = Math.floor(Math.random() * choices.length);
    return choices[index]
}


async function generateCaptcha(){
    let caracters = [..."1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    let letters = [];
    for(let i = 0;i < 6; i++) letters.push(caracters[Math.floor(Math.random() * caracters.length)])
    // letters.join("")
    const text = letters.toString().replace(/,/g, "")
    console.log("TEXT : " + text)
    const textToDisplay = letters.toString().replace(/,/g, " ")


    const canvas = Canvas.createCanvas(300, 150)
    const ctx = canvas.getContext("2d")

    // Draw background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw noisy background
    ctx.fillStyle = "#cccccc";
    for (let i = 0; i < 500; i++) {
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    // Draw distorted text
    ctx.font = "35px Bitstream Vera Sans Mono";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Adding text with distortion
    for (let i = 0; i < text.length; i++) {
        ctx.save();
        ctx.translate((canvas.width / 2) + (i - 2) * 30, canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4); // Random rotation between -0.2 and 0.2 radians
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }

    // Add random lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    // Add random shapes
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 10, 0, 2 * Math.PI);
        ctx.fill();
    }


    return {canvas: canvas, text: text}

}


async function getRoles(guild, params){
    const DBGuild = await Guilds.findOne({ id: guild.id });

    if (!DBGuild) {
        console.error(`Guild with ID ${guild.id} not found in database.`);
        return [];
    }

    if(Object.keys(params).length === 0){
        return DBGuild.roles
    }

    const roles = [];

    for (const role of DBGuild.roles) {
        const key = Object.keys(params)[0];
        const value = params[key];

        if (role[key] === value) {
            roles.push(role);
        }
    }

    return roles

}



        
module.exports = { 
    randchoice: randchoice,
    generateCaptcha: generateCaptcha,
    getRoles: getRoles
}


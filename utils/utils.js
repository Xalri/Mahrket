function randchoice(choices){
    let index = Math.floor(Math.random() * choices.length);
    return choices[index]
}

module.exports = randchoice
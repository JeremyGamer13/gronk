class Command {
    constructor(client) {
        this.name = "killeveryoneinthisserver";
        this.description = "i dont like you";
        this.attributes = {
            unlisted: true
        };
    }

    invoke(message, args, util) {
        message.reply("erm,,, incorrect");
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
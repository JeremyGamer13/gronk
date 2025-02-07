class Command {
    constructor(client) {
        this.name = "test";
        this.description = "poo poo";
        this.attributes = {
            unlisted: true,
            permission: 1,
        };

        this.client = client;
    }

    invoke(message, args, util) {
        message.reply(JSON.stringify(args));
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
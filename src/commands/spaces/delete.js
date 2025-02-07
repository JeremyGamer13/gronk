class Command {
    constructor() {
        this.name = "delete";
        this.description = "Deletes a message in your <#1181097377730400287>.";
        this.attributes = {
            unlisted: false,
            admin: false,
            spaceOwner: true,
        };
    }

    async invoke(message, args, util) {
        const reply = await util.getReply(message);
        if (!reply) return message.reply('You need to reply to a message to delete it.');
        reply.delete();
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
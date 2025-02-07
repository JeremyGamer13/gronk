class Command {
    constructor() {
        this.name = "reason";
        this.description = "Get the reason a person was banned off the server";
        this.attributes = {
            unlisted: true,
            permission: 2,
        };

        this.alias = ['ban', 'banreason', 'br', 'breason', 'banr'];
    }

    async invoke(message, args) {
        const id = args[0].match(/^(<@!?(?<id>[0-9]+)>)$/i)?.groups?.id ?? args[0];
        const guild = message.guild;
        const ban = await guild.bans.fetch(id).catch(() => {});
        if (!ban) return message.reply(`no ban found for user <@${id}>`);
        message.reply(`ban <@${id}>: \`${ban.reason}\``);
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;

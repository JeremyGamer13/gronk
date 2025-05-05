const fs = require('fs');
const path = require("path");

const configuration = require("../../config");

const responses = [];
const files = fs.readdirSync(path.join(__dirname, '..', 'responses'));
for (const file of files) {
    if (file === 'index.js') continue;
    if (file === 'custom') continue;
    const data = require(`./${file}`);
    for (const check of data.terms) {
        responses.push({
            check,
            data: data.message
        });
    }
}

module.exports = (message) => {
    const content = String(message.cleanContent).toLowerCase().replace(/[ \n\t',.!?]+/gmi, '');
    if (!configuration.autoResponseChannels.includes(message.channel.id)) {
        return;
    }
    for (const { check, data } of responses) {
        if (content.includes(check)) {
            let msg = data.message ?? data;
            // custom responses (for example run actions on the message after responding)
            if (data.custom) {
                const module = require(`./custom/${data.custom}.js`);
                module(message);
                return;
            }
            if (data.oneof) {
                const random = Math.floor(Math.random() * data.messages.length);
                msg = data.messages[random];
            }
            if (data.onlyfiles) {
                msg = { files: [msg] };
            }
            message.reply(msg);
            return true;
        }
    }
}
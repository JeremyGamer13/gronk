const discord = require("discord.js");
const CommandUtility = require("../../util/utility.js");

const handleBotAutoResponse = require('../../resources/responses/index.js');
const gronkResponse = require('../../util/gronk-response.js');
const configuration = require("../../config");
const env = require("../../util/env-util");

const isInTestMode = process.argv[2] === 'test';
const prefix = isInTestMode ? env.get("PREFIX_TEST") : env.get("PREFIX");

class BotEvent {
    constructor(client) {
        this.listener = "messageCreate";
        this.once = false;

        this.client = client;
    }

    /**
     * @param {discord.Client} client 
     * @param {*} state 
     * @param {discord.Message} message 
     * @returns 
     */
    async invoke(client, state, message) {
        // ignore bots
        if (!message.author) return;
        if (message.author.bot) return;
        if (message.author.system) return;
        if (message.system) return;

        const isTestingInPublic = isInTestMode && !(env.getBool("CHECK_FOR_DEFAULT_TEST_SERVERS") && message.guildId === "746156168560508950")

        // ignore #spam
        if (
            message.channel.id === configuration.channels.spam
            || (message.channel.parent && message.channel.parent.id === configuration.channels.spam)
        ) return;

        CommandUtility.state = state;
    
        // handle the case where they are not using a cmd but we can still do stuff
        if (!message.content.startsWith(prefix)) {
            // check for stuff we can reply to in a helpful way
            if (env.getBool('RESPOND_TO_KEYWORDS') && !isTestingInPublic) {
                handleBotAutoResponse(message);
            }

            if (!message.guild) return;

            let isReplyToGronk = false;
            let repliedMessage = null;
            if (env.getBool('RESPOND_TO_REPLIES')) {
                // check if this is a reply
                if (message.reference && message.reference.messageId) {
                    repliedMessage = message.channel.messages.cache.get(message.reference.messageId);
                    isReplyToGronk = repliedMessage.author.id === '750179777637515264';
                }
            }

            // check for my ping
            if (!isReplyToGronk) {
                const firstMentioned = message.mentions.members.first();
                if (!firstMentioned) return;
                if (firstMentioned.user.id !== '750179777637515264') return;
                if (!message.content.trim().startsWith('<@750179777637515264>')) return;
            }

            const responseString = await gronkResponse(message, env.getBool('RESPOND_TO_REPLIES') ? repliedMessage : null);
            return message.reply({
                content: responseString.substring(0, 2000),
                allowedMentions: {
                    parse: [],
                    users: [],
                    roles: [],
                    repliedUser: true
                }
            });
        }
    
        // handle cmds
        // this is perhaps a command
        const split = message.content.split(' ');
        split[0] = split[0].replace(prefix, '');
        if (!(split[0] in state.commands)) {
            return;
        }
    
        const commandName = split[0];
        const command = state.commands[commandName];
    
        const isBlocked = CommandUtility.handleCommandBlock(command, message, split);
        if (isBlocked) return;
    
        // remove the command name argument
        split.shift();

        // some commands can allow number conversion
        const convertNums = command.attributes.numberConversion === true;
        const args = convertNums ? split.map(argument => {
            if (isNaN(Number(argument))) {
                return String(argument);
            }
            return Number(argument);
        }) : split;
    
        // use command now
        try {
            /* client is passed so the command can send messages in arbitrary channels */
            await command.invoke(message, args, CommandUtility, client);
        } catch (err) {
            console.error(err);
            message.reply({
                content: `An unknown error occurred.\n${err}`,
                allowedMentions: {
                    parse: [],
                    users: [],
                    roles: [],
                    repliedUser: true
                }
            });
        }
    }
}

module.exports = BotEvent;
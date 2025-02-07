const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
const glob = require("glob");

class BotEvent {
    constructor(client) {
        this.listener = "ready";
        this.once = true;

        this.client = client;
    }

    async invoke(client, state) {
        require('dotenv').config();
        const isInTestMode = state.isInTestMode;

        // log we are online
        console.log(client.user.tag + " is online!");

        // register commands
        const files = glob.globSync('./src/commands/**')
            .map(file => `../../commands/${file.replace(/\\/g, '/').replace('src/commands/', '')}`)
            .filter(file => file.endsWith('.js'))
            .filter(file => file.substring(file.lastIndexOf("/")).match(/\.{1}/).length === 1);

        let errors = '';
        let failed = false;

        // handle files
        const slash = [];
        for (const fileName of files) {
            try {
                // modules should be treated as objects with commandName:CommandClass pairs if they arent already
                let module = require(fileName);
                if (module.name) {
                    const commandClass = module;
                    module = {
                        [module.name]: commandClass
                    };
                }

                for (const commandName in module) {
                    const commandClass = module[commandName];
                    const command = new commandClass(client);

                    // Define a function to create a new instance of the command
                    command.instantiate = () => {
                        return new commandClass(client);
                    };

                    // Register command and aliases in state.commands map
                    state.commands[command.name] = command;
                    state.slash[command.name] = command.convertSlashCommand || (() => false);

                    if (command.slash) {
                        command.slash.name = command.name;
                        command.slash.description = command.slashdescription || command.description;
                        slash.push(command.slash);
                        console.log('Slash command', command.name, 'is queued...');
                    }

                    if (Array.isArray(command.alias)) {
                        for (const alias of command.alias) {
                            state.commands[alias] = command;
                        }
                    }

                    console.log('Registered', command.name);
                }
            } catch (err) {
                console.error('Failed to load', fileName, '\n', err.message);
                errors += `\`\`${fileName}\`\` - ${err.message}\n`;
                failed = true;
            }
        }

        // register slash commands
        synchronizeSlashCommands(client, slash, {
            debug: false,
        });
        console.log('Registered slash commands!');

        // set our status
        client.user.setPresence({
            status: "online",
            activities: [{
                name: isInTestMode ? 'PenguinBot Testing' : 'PenguinMod | pm!help',
                type: "PLAYING"
            }]
        });

        // log
        const mainChannel = await client.channels.cache.get('1139749855913316474');
        mainChannel.send({
            content: isInTestMode ?
                'Bot has restarted in test mode. Certain features will not be enabled.' :
                'Bot has restarted.'
        });

        // log when commands cant load
        if (failed) {
            mainChannel.send(`Some commands failed to load.\n\n${errors}`.substring(0, 2000));
        }
    }
}

module.exports = BotEvent;
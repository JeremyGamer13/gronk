const env = require("./util/env-util");

// Seperated from .env since these are mostly cosmetic changes or big lists.
const configuration = {
    // Used in cases like "Welcome to the {NAME} server!" and "Do not post NSFW invites in the {NAME} server."
    nameReference: "Server",
    // The name of your bot (some files like the credits command will still say PenguinBot, since this is PenguinBot's code)
    nameBotReference: "gronk",

    // Status of the bot, stated in Discord like "Playing (text)" or "Playing a game" then, on a new line "(text)"
    status: {
        // The bot can use seperate text when running in test mode.
        // Note that the .env variables are available here if you use stuff like {{NAME}}, avoid using something like {{TOKEN}} or {{PENGUINMOD_PASSWORD}}
        normal: "the latest AI grifter scamming technology",
        testing: "the latest AI grifter scamming technology",
    },

    // The bot has many auto responses, toggled using the RESPOND_TO_KEYWORDS env. They will only be usable in these channels:
    autoResponseChannels: [
        // These are the channels used in PenguinMod's server:
        // dont include things like bug reports or suggestions
        '1038238583686967428', // penguin-chat
        '1038236110335266907', // off-topic
        '1038251459843723274', // commands
        '1139749855913316474', // penguinbot-test
        '746156168560508953', // test thing
    ],

    // Used to link to channels within the server. These IDs are the ones we use in PenguinMod.
    channels: {
        // A channel for PenguinBot testing and occasional logging.
        botTestingChannel: "746156168560508953",

        // A channel dedicated to bot commands.
        commands: "1038251459843723274",

        // A channel dedicated to bot commands for developers.
        commandsDev: "1174359501688803358",

        // The channel where blocked automod alerts are sent. PenguinBot will send automod bypass alerts here too, if the basic_automod file is added.
        // See src/util/utility.js to see where basic_automod is used.
        automod: "746156168560508953",

        // A channel where PenguinBot can send reported users to. Usable via /report
        userReports: "746156168560508953",

        // A channel where PenguinBot can send reported mods to. Usable via /modreport
        adminReports: "746156168560508953",

        help: "746156168560508953",
        spaces: "746156168560508953",
        teamWanted: "746156168560508953",
        spam: "1040077506029551647",
    },

    permissions: {
        // Permission Level 1: A low permission level that isnt used much.
        permission1: [
        ],
        // Permission Level 2: Reserved for moderator commands.
        permission2: [
        ],
        // Permission Level 3: Mostly developer commands.
        permission3: [
        ],

        // User IDs that can always use donator commands:
        exclusiveUsers: [env.get("OWNER"), "462098932571308033"],

        // Role IDs considered "exclusive", so Server booster & Donator
        exclusiveRoles: [
        ],

        // Channels checked for in the lockedToCommands property (excluding commands channel from above & threads within that channel)
        lockedToCommands: [
            // These are the channels allowed in PenguinMod's server:
            '746156168560508953', // epic test channel
            '1139749855913316474', // penguinbot-test
        ],

        // On top of the permission check, who can use pm!eval (run custom code)
        eval: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!echo
        echo: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!delmsg
        delmsg: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!penguinbotupload
        penguinbotupload: [env.get("OWNER"), "462098932571308033"],

        // Who can use "force" options in pm!exclusiverole
        exclusiveroleForce: [env.get("OWNER"), "462098932571308033"],
    },
};

module.exports = configuration;
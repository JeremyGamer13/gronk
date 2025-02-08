const Discord = require("discord.js");

const { createCanvas, loadImage } = require('canvas');

class SigmaCommand {
    constructor() {
        this.name = "sigma";
        this.description = "I feel so sigma!";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };
    }

    async invoke(message, args, util) {
        const [imageUrl] = await util.getInputImageForCommand(message, true);
        if (!imageUrl) return;

        const userImage = await loadImage(imageUrl);
        const sigmaTemplate = await loadImage('assets/feelsosigma.png');

        // Create a canvas
        const canvas = createCanvas(sigmaTemplate.width, sigmaTemplate.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(sigmaTemplate, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(userImage, 29, 169, 287, 287);
        
        // Convert the canvas to a Discord attachment
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sigma.png');

        // Send the license image as a reply
        message.reply({ files: [attachment] });
    }
}

module.exports = SigmaCommand;

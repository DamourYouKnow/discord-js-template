
const fs = require('fs');
const yaml = require('js-yaml');

const config = yaml.safeLoad(fs.readFileSync('config.yml'));

module.exports = {};

module.exports.Commands = class {
    constructor() {
        this.commands = { };
    }

    add(command, handler) {
        this.commands[command.name] = handler;
        if (command.aliases) {
            for (const alias of command.aliases) {
                this.commands[alias] = handler;
            }
        }
    }

    exists(command) {
        return command in this.commands;
    }

    execute(command, message, args=[]) {
        this.commands[command].apply(null, [message, ...args]);
    }
};

module.exports.messageHandler = function(commands, message) {
    if (message.content.startsWith(config.commandPrefix)) {
        const command = message.content.substring(config.commandPrefix.length)
            .split(' ')[0];
        if (commands.exists(command)) {
            const args = message.content.split(' ').slice(1);
            commands.execute(command, message, args);
        }
    }
};

module.exports.login = function(client) {
    if (process.env.DISCORD_API_TOKEN) {
        client.login(process.env.DISCORD_API_TOKEN);
    } else if (config.token) {
        client.login(client.token);
    } else {
        console.log('No token provided in config.yml or auth.json');
    }
};

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.once("ready", (client) => {
  	console.log(`Ready! Logged in as ${client.user.tag}`);
})

client.login(process.env.TOKEN)

module.exports = client
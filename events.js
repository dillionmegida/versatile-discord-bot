const client = require('./init')
const {createUserTag} = require('./utils.js')

const BAD_WORDS = ["fuck"]

client.on("messageCreate", async (message) => {
  if(message.author.bot) return;

  if (message.content.toLowerCase().includes("Giveaway")) {
    giveaway(message)
  }

  if(message.content.includes("greet")) {
    const users = Array.from(message.mentions.users, ([id, data]) => ({id, data}));

    users.forEach(userObj => {
    const user = userObj.data
    
    message.channel.send("Boss " + createUserTag(user.id) + "...them say make i greet you oo")
    })

  }

  BAD_WORDS.forEach(word => {
    if(message.content.includes(word)) {
      message.reply("Boss...if you type this nonsense again, I go commot you")
    }
  })
})
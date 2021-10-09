const client = require('./init')
const {createUserTag, getRandomVal} = require('./utils.js')
const { initGiveawayWithDBInteraction } = require('./giveaway.js')
const {BAD_WORDS, BAD_WORDS_REPLIES} = require('./constants.js')

client.on("messageCreate", async (message) => {
  if(message.author.bot) return;

  const messageContent = message.content.toLowerCase()

  if(messageContent.includes("giveaway"))
  initGiveawayWithDBInteraction(message);

  if(messageContent.includes("greet")) {
    const users = Array.from(message.mentions.users, ([id, data]) => ({id, data}));

    users.forEach(userObj => {
    const user = userObj.data
    
    message.channel.send("Boss " + createUserTag(user.id) + "...them say make i greet you oo")
    })

  }

  BAD_WORDS.forEach(word => {
    if(messageContent.includes(word)) {
      message.reply(`Hey boss... usage of "${word}" is not permitted here. ${getRandomVal(BAD_WORDS_REPLIES)}`)
    }
  })
})
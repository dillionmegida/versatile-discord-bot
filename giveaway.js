/* 
This stuff is supposed to do giveaway. I'm feeling sleepy, text might be incomprehensible. Take note.

Ensure to fix the bugs here after reading, this life is like yam.

Works like so:
- User invokes with `giveaway [channel] [number of recepients]`. Channel currently includes just Abeg and account

- Bot responds with message and creates a record in the DB to track this giveaway.
  record has a uuid to ensure multiple giveaways can go on at one time. uuid is included in bot response

- People who respond with the uuid of the giveaway and their details are added to list of recepients
  till it is up to the number specified by the giver.

- When number is complete, bot notifies the giver of the completion
*/


const {createUserTag} = require('./utils.js')
const Client = require("@replit/database")
const client = new Client();
const GIVEAWAY = "giveaway"

// const schema = [
//   "uuid",
//   "user",
//   "channel",
//   "channelId",
//   "recepientsLength",
//   "recepients",
// ]

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Bug stems from the database not existing. Seems like `initDBForGiveaway`
// is not running since it still refers to the table as null
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const GIVEAWAY_CHANNELS = {
  "abeg": {
    validation: "^@\w+"
  },
  "account": {
    validation: "\d{10}"
  }
}

const giveawayRegex = `^giveaway ${Object.keys(GIVEAWAY_CHANNELS).join('|')} \d{1}$`

const getGiveawayDetails = (message) => {
  // expects valid giveaway message
  
  return {
    channel: message.slice(9, -2).toLowerCase(),
    recepientsLength:  message.slice(-1)
  }
}

const provideGiveawayDB = () => {
  // provides a promise with direct access to 'giveaway' table

  return client.get(GIVEAWAY);
}

const initDBForGiveaway = async () => {
  // Initialized the DB with an empty object if and only if
  // the DB hasn't been initialized

  let set = false
  provideGiveawayDB()
    .then(giveaway => {
      if (!giveaway) {
        client.set(GIVEAWAY, {})
      }
    })
}


const createGiveawayTag = async () => {
  // creates a unique uuid to be used as a key for giveaway
  // checks the db to confirm it is unique

  let uuid;
  let completed = false;
  while (!completed) {
    uuid = Math.ceil(Math.random() * 1000000)
    await provideGiveawayDB()
      .then((giveaway) => {
        if (!giveaway[uuid]) {
          completed = true
        }
      })
      .catch(err => console.log(err))
  }

  return uuid;
}

const createGiveawayRecord = async (uuid, user, channel, channelId, recepientsLength) => {
  // creates a giveaway record, assumes record to not be in
  // DB before now

  await provideGiveawayDB()
    .then(giveaway => {
      giveaway[uuid] = {
        user,
        channel,
        channelId,
        recepientsLength,
        recepients: []
      }

      client.set(GIVEAWAY, giveaway)
    })
}

const getSingleGiveawayRecord = async (uuid) => {
  // Returns a single giveaway record or undefined

  let record;
  await provideGiveawayDB()
    .then(giveaway => {
      // you've got to check the result oo
      record = giveaway[uuid]
    })

  return record;
}

const updateSingleGiveawayRecord = (uuid, details) => {
  // lazy func, will not check if details is in correct format
  // I'm tired. Person go fix am later

  let success;
  getSingleGiveawayRecord()
    .then(record => {
      if (record) {
        provideGiveawayDB()
          .then(giveaway => {
            giveaway[uuid] = details
            client.set(GIVEAWAY, giveaway)
          })
        success = true;
      }
    })
  
  return success;
}

const deleteSingleGiveawayRecord = (uuid) => {
  updateSingleGiveawayRecord(uuid, {})
}

// let's hope to God this stuff works, not testing till we're done.

const initGiveawayWithDBInteraction = (rawMessage) => {
  
  const message = rawMessage.content.toLowerCase();
  rawMessage.reply("Something is going on")
  
  if (!message.match(new RegExp(giveawayRegex))) {
    rawMessage.reply("This is not a giveaway");
    return
  }

  initDBForGiveaway();

  const { channel, recepientsLength} = getGiveawayDetails(message);
  const uuid = createGiveawayTag();
  createGiveawayRecord(
    uuid,
    rawMessage.author.id,
    channel,
    rawMessage.channelId,
    recepientsLength
  )

  rawMessage.reply(`Dear premium boss, ${createUserTag(rawMessage.author.id)}
    A giveaway has been created with the tag: ${uuid}. Prepare your funds
  `)
}

module.exports = {
  initGiveawayWithDBInteraction
}

// can it be tested? Lol
// const createGiveawayRegex = () => {
//   let initString = `^giveaway ${GIVEAWAY_CHANNELS.join('|')} \d{1}$`
// }




// const doGiveaway = (rawMessage) => {
//   const message = rawMessage.toLowerCase();
  
//   if (!message.match(new RegExp(giveawayRegex))) return;
  
//   const { channel, recepientsLength} = getGiveawayDetails(message);
  
// }
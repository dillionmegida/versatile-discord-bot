const Database = require("@replit/database")
const db = new Database()

const schema = [
  "uuid",
  "user",
  "channel",
  "recepientsLength"
  "recepients",
]

const initDbForGiveaway = () => {
  db.get("giveaway")
    .then(giveaway => {
      if (!giveaway) {
        db.set("giveaway", {})
      }
    })
}

const createGiveawayTag = () => {
  let uuid;
  while (true) {
  uuid = Math.ceil(Math.random() * 1000000)
    db.get(uuid)
      .then(uuid => {
        if (uuid) {
          continue
        }
        
        break;
    })
  }

  return uuid;
}

const createGiveawayRecord = (user, channel, recepientsLength) => {
  initDbForGiveaway();

  db.get()
}
const ABEG_TAGS = []
const GIVEAWAY_CHANNELS = {
  "abeg": {
    validation: "^@\w+"
  },
  "account": {
    validation: "\d{10}"
  }
}

const giveawayRegex = `^giveaway ${Object.keys(GIVEAWAY_CHANNELS).join('|')} \d{1}$`

// const createGiveawayRegex = () => {
//   let initString = `^giveaway ${GIVEAWAY_CHANNELS.join('|')} \d{1}$`
// }


const getGiveawayDetails = (message) => {
  // expects valid giveaway message
  
  return {
    channel: message.slice(9, -2).toLowerCase(),
    recepientsLength:  message.slice(-1)
  }
}


const doGiveaway = (rawMessage) => {
  const message = rawMessage.toLowerCase();
  
  if (!message.match(new RegExp(giveawayRegex))) return;
  
  const { channel, recepientsLength} = getGiveawayDetails(message);
  
}
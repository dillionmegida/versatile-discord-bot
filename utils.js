const createUserTag = id => `<@${id}>`

const getRandomVal = arr => arr[Math.floor(Math.random() * arr.length)];

module.exports = {
  createUserTag,
  getRandomVal
}
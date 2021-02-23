const NATS = require('nats')
const nc = NATS.connect({
  url: process.env.NATS_URL || 'nats://nats:4222'
})

const { Webhook, MessageBuilder } = require('discord-webhook-node')
const myurl = process.env.DISCORD_WEBHOOK
const hook = new Webhook(myurl)
 
let preoccupied = false

nc.subscribe('broadcast_status', (msg) => {
  if (preoccupied) return
  if (msg == 'anybody_there') return nc.publish('broadcast_status', 'i_am')
})

const setReady = () => {
  const saved_subscription = nc.subscribe('saved_todo', { queue: 'workers.broadcaster' }, (msg) => {
    preoccupied = true
    nc.unsubscribe(saved_subscription)
    sendToDiscord(JSON.stringify(msg))
  })
  preoccupied = false
  const updated_subscription = nc.subscribe('updated_todo', { queue: 'workers.broadcaster' }, (msg) => {
    preoccupied = true
    nc.unsubscribe(updated_subscription)
    sendUpdateToDiscord(JSON.stringify(msg))
  })
  preoccupied = false
  const delete_subscription = nc.subscribe('deleted_todo', { queue: 'workers.broadcaster' }, (msg) => {
    preoccupied = true
    nc.unsubscribe(delete_subscription)
    sendDeleteToDiscord(JSON.stringify(msg))
  })
  preoccupied = false
  nc.publish('broadcast_status', 'i_am')
}

const sendUpdateToDiscord = async ( todo ) => {
  const embeds = new MessageBuilder()
    .setTitle('Todo messaging')
    .setAuthor('Message Bot')
    .addField('Todo was updated', `${todo}`, true)
    .setColor('#00b0f4')
    .setTimestamp()
  
  await hook.send(embeds)
  setReady()
}
const sendToDiscord = async ( todo ) => {
  const embeds = new MessageBuilder()
    .setTitle('Todo messaging')
    .setAuthor('Message Bot')
    .addField('Todo was saved', `${todo}`, true)
    .setTimestamp()
  
  await hook.send(embeds)
  setReady()
}

const sendDeleteToDiscord = async ( todo ) => {
  const embeds = new MessageBuilder()
    .setTitle('Todo messaging')
    .setAuthor('Message Bot')
    .addField('Todo was deleted', `${todo}`, true)
    .setColor('#00b0f4')
    .setTimestamp()
  
  await hook.send(embeds)
  setReady()
}

setReady()

console.log('Broadcaster listening')
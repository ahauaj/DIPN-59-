const Discord = require("discord.js");
const db = require('quick.db');
const owner = new db.table("Owner");
const config = require("../config");

module.exports = {
  name: 'dnd',
  usage: 'dnd',
  description: `Met le statut du bot en "Ne pas déranger".`,
  async execute(client, message, args) {

    if (owner.get(`owners.${message.author.id}`) || config.bot.buyer.includes(message.author.id) || config.bot.funny.includes(message.author.id)) {

      if (!message.guild) return;

      client.user.setStatus('dnd');
    }
  }
};
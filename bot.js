const { Telegraf } = require("telegraf");
const { botInfo } = require("./config");

const { getMessages } = require("./db/messages");
const findCoincidence = require("./utils/findCoincidence");

const bot = new Telegraf(botInfo.token);

bot.on("message", async (ctx) => {
  let messages = await getMessages();
});

module.exports = bot;

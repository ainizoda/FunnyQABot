const { Telegraf } = require("telegraf");
const { botInfo } = require("./config");

const { getMessages } = require("./db/messages");
const findCoincidence = require("./utils/findCoincidence");

const bot = new Telegraf(botInfo.token);

bot.on("message", async (ctx) => {
  let messages = await getMessages();

  for (let i = 0; i < messages.length; i++) {
    let coincidence = findCoincidence(ctx.message.text, messages[i].text);

    if (coincidence > 0) {
      ctx.reply(messages[i].reply);
    }
  }
});

module.exports = bot;

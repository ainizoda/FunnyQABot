const { Telegraf } = require("telegraf");
const { Api, TelegramClient } = require("telegram");

const config = require("./config");
const { getMessages, addMessage } = require("./db/messages");

const bot = new Telegraf(config.botInfo.token);

const client = new TelegramClient(
  config.appInfo.session,
  config.appInfo.id,
  config.appInfo.hash,
  {}
);

(async function () {
  await client.connect();
})();

bot.on("message", async (ctx) => {
  const { text, message_id } = ctx.message;
  const userId = ctx.from.id;

  let replyToMessage;

  if (userId !== config.appInfo.myUserId) {
    replyToMessage = await client.invoke(
      new Api.channels.GetMessages({
        channel: `${ctx.chat.id}`,
        id: [message_id],
      })
    );
  }

  console.log(replyToMessage);

  const message = {
    tgId: message_id,
    created: Date.now(),
    userId,
    text,
  };

  await addMessage(message);
});

bot.launch();

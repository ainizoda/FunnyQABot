const { Telegraf } = require("telegraf");

const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const appInfo = {
  id: 12217976,
  hash: "77c370d62cf65047ff0dc0b1ec7d6734",
  session: new StringSession(
    "1AgAOMTQ5LjE1NC4xNjcuNTEBuwONvCOLVLVwXRYw+9UpXpJba4M/hRhqdnvAIn+qUKTEczhpIk6xHeV76gIHm0DpuG4f53/hapm5XBSvUIZ2TXiIfpFOBbNZ/vuBeMSaXz0LTVJk1jo+gjlwcpm2tSOTqDXQkkgA8cZEpTNJ//Oiotopvrt+uDI9Ovx9dACEDKRxSw9kLXAZiTLZxpGe2bNxKWr/fbm8JETxLrFNq/83ljMVKbQEPKJYbvZzU0KtEn0pvdETQkSD6vcWpkqisjNl4I2G2xf6+brQY6JppvxHPrzzLQVlm8QdJE5W4s+BRwLWUstzkzU/KG2zN+n1Ldx2+b0rEFVgWjDk7aAbaMrYyaw="
  ),
};

const botInfo = {
  token: "5036842883:AAFxJ1V2dfUnUv42QgYa4h_MeKY1mIgCTJo",
};

const bot = new Telegraf(botInfo.token);

const { id, session, hash } = appInfo;

const client = new TelegramClient(session, id, hash, {});

(async () => {
  await client.connect();
})();

bot.on("message", async (ctx) => {
  const chatId = ctx.chat.id;

  const messages = await getMessageHistory(chatId);
  console.log(messages);
  const { message_id, text } = ctx.message;

  const words = text?.split(" ").map((word) => word.toLowerCase());

  let messageIndex = -1;

  for (let i = 0; i < words?.length; i++) {
    for (let j = 1; j < messages?.length; j++) {
      if (messages[j].toLowerCase().includes(words[i])) {
        messageIndex = j;
        console.log("found");
        break;
      }
    }
  }

  if (messageIndex > -1 && messages[messageIndex - 1]?.length > 0) {
    ctx.reply(messages[messageIndex - 1], {
      reply_to_message_id: message_id,
    });
  }
});

const getMessageHistory = async (chatId) => {
  const result = await client.invoke(
    new Api.messages.GetHistory({
      peer: `${chatId}`,
    })
  );

  const parsed = await result.messages
    .filter((m) => m.message)
    .map((mes) => mes.message);

  return Array.from(new Set(parsed));
};

bot.launch();

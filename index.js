const { Api } = require("telegram");

const { addMessage } = require("./db/messages");

const { NewMessage } = require("telegram/events");
const { configuredClient } = require("./services/client");

const bot = require("./bot");
const input = require("input");

let client;

(async function () {
  client = await configuredClient();

  client.addEventHandler(handleSaveToDataBase, new NewMessage({}));

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
})();

async function getChatHistory(chatPeer) {
  return await client.invoke(
    new Api.messages.GetHistory({
      peer: chatPeer,
    })
  );
}

function getPrevMessage(history) {
  let prevMessage;

  let userId = history.messages[0].fromId.userId.value;

  let { messages } = history;

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].fromId.userId.value !== userId) {
      prevMessage = messages[i];
      break;
    }
  }

  return prevMessage;
}

async function handleSaveToDataBase(event) {
  const chatHistory = await getChatHistory(event.message.peerId);

  const messageReply = event.message.originalArgs.replyTo;

  let replyText;

  if (messageReply) {
    replyText = chatHistory.messages.find(
      (message) => message.id === messageReply.replyToMsgId
    );
  } else {
    replyText = getPrevMessage(chatHistory);
  }

  let dmessage = {
    id: event.message.id,
    text: replyText.message,
    reply: event.message.message,
    created: `${Date.now()}`,
    userId: `${replyText.fromId.userId.value}`,
  };

  await addMessage(dmessage);
}

bot.launch();

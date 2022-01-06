const { Api } = require("telegram");

const getMessageById = (client, messageId) => {
  return client.invoke(
    new Api.messages.GetMessages({
      id: messageId,
    })
  );
};

module.exports = {
  getMessageById,
};

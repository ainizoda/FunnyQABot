const knex = require("./knex");

const messages = knex("messages");

const addMessage = (message) => {
  return messages.insert(message);
};

const getMessages = () => {
  return messages.select("*");
};

const deleteMessage = (id) => {
  return messages.where("id", id).delete();
};

module.exports = {
  addMessage,
  getMessages,
  deleteMessage,
};

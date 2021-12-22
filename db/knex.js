const knex = require("knex");

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "tmessages.db",
  },
  useNullAsDefault: true,
});

module.exports = connectedKnex;

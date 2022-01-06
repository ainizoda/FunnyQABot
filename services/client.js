const { TelegramClient } = require("telegram");
const config = require("../config");

async function configuredClient() {
  const client = new TelegramClient(
    config.appInfo.session,
    config.appInfo.id,
    config.appInfo.hash,
    {
      appVersion: "8.4.2",
      deviceModel: "PC",
      systemVersion: "Windows 10",
    }
  );

  return client;
}

module.exports = {
  configuredClient,
};

import { Telegraf } from "telegraf";
import fs from "fs";
import axios from "axios";
import path from "path";
import request from "request";

const documentsDirectory = "documents";

if (!fs.existsSync(documentsDirectory)) {
  fs.mkdirSync(documentsDirectory);
}

const botInfo = {
  token: "2115555272:AAFMCjNU-QAGIOu6ravWUykQy9wRxFTPMz4",
};

const chatInfo = {
  id: -1001768859093,
};

const bot = new Telegraf(botInfo.token);

const descriptions = {
  shortWelcome: "Добро пожаловать",
  welcomeText: "Здравствуйте, бот предназначен для отправки ДЗ",
  usernameRequired:
    "Сначала задайте себе юзернейм в профиле, потом снова попробуйте сделать /start ",
};

bot.start(async (ctx) => {
  ctx.reply(descriptions.welcomeText);

  if (!ctx.from.username) {
    ctx.reply(descriptions.usernameRequired);
    return;
  }

  ctx.reply(descriptions.shortWelcome);

  const { id, username, last_name, first_name } = ctx.from;

  const users = await getAllUsers();

  const user = {
    fullName: `${first_name} ${last_name}`,
    username,
    id,
  };

  fs.writeFile("users.txt", JSON.stringify([user, ...users]), (err) => {
    if (err) {
      console.log(err);
    }
  });
});

bot.on("text", (ctx) => {
  const reply = ctx.message.reply_to_message;

  const admins = ["habibaaslonova", "mav3un", "Zebo2404", "ainizoda"];
  const isAdmin = admins.indexOf(ctx.message.from.username) > -1;

  if (!isAdmin) {
    bot.telegram.sendMessage(
      chatInfo.id,
      `@${ctx.from.username}: ${ctx.message.text}`
    );
  }

  if (reply) {
    if (isAdmin) {
      const { text } = reply;

      const username =
        text.indexOf("@") !== 0
          ? text.slice(text.lastIndexOf("@") + 1)
          : text.slice(1, text.indexOf(":"));

      if (text.indexOf("@") > -1) {
        sendMessageToUser(username, ctx.message.text);
      }

      return;
    } else {
      console.log("user");
    }
  }
});

bot.on("document", async (msg) => {
  const fileId = msg.update.message.document.file_id;
  const request = await axios.get(
    `https://api.telegram.org/bot${botInfo.token}/getFile?file_id=${fileId}`
  );

  const filePath = request.data.result.file_path;
  const { from } = msg;

  const downloadURL = `https://api.telegram.org/file/bot${botInfo.token}/${filePath}`;

  const fullFilePath = path.join(
    documentsDirectory,
    `${fileId}${filePath.slice(filePath.lastIndexOf("."))}`
  );

  downloadFile(downloadURL, fullFilePath, () => {
    sendFile(fullFilePath, chatInfo.id, from);

    console.log("Done!");
  });
});

const downloadFile = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const sendFile = (filePath, chatId, from) => {
  bot.telegram.sendMessage(
    chatId,
    `Файл отправил(-а): ${from.first_name} | @${from.username}`
  );

  bot.telegram.sendDocument(chatId, { source: filePath });
};

const getAllUsers = () => {
  return new Promise((res) => {
    fs.readFile("users.txt", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      res(JSON.parse(data));
    });
  });
};

const sendMessageToUser = async (username, message) => {
  const users = await getAllUsers();

  const user = users.find((usr) => usr.username === username);
  const { id } = user;

  bot.telegram.sendMessage(id, message);
};

bot.launch();

const Database = require('../services/Database');
const Games = require('../services/Games');
const Bot = require('../services/Bot');
const Message = require('../factories/Message');
const path = require('path');
const Sanitize = require('../services/Sanitize');

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = class Main {
  static async update(req, res) {
    const db = new Database();

    try {
      const { games: gamesDirty } = req.body;

      const token = process.env.TOKEN;
      const chatIdGroup = process.env.CHAT_ID_GROUP;
      const chatIdAdmin = process.env.CHAT_ID_ADMIN;

      const botGroup = new Bot(token, chatIdGroup);
      const botAdmin = new Bot(token, chatIdAdmin);

      const newGames = new Sanitize(gamesDirty).get();

      if (newGames.length) {
        const oldGames = await db.get();

        const { keep, add, remove } = new Games(oldGames).set(newGames, oldGames).get();

        await db.set([...add, ...keep]);

        const msg = new Message(add, keep, remove);

        const addMessage = msg.add();
        const adminMessage = msg.admin();

        let result = {};
        console.log({ remove });

        if (addMessage) {
          if (addMessage.length) result.botGroup = await botGroup.sendMessage(addMessage);
        }

        if (adminMessage) {
          if (adminMessage.length) result.botAdmin = await botAdmin.sendMessage(adminMessage);
        }

        return res.send({ realDatabase: db.get(), database: { keep, add, remove } });
      }

      throw {
        error: true,
        sucess: false,
        messagem: 'No valid games',
        debug: newGames,
      };
    } catch (e) {
      res.status(500).send({
        error: true,
        sucess: false,
        messagem: e.message,
        debug: e.stack,
      });

      await db.rollback();

      console.error(e);
    }
  }

  static async status(req, res) {
    const db = new Database();
    const oldGames = await db.get();

    return res.status(201).send({
      error: false,
      sucess: true,
      messagem: "I'm alive!",
      debug: oldGames,
    });
  }
};

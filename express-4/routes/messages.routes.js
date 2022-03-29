const { Router } = require('express');

const messagesController = require('../controllers/messages.controller');

const messagesRouter = Router();

messagesRouter.get('/photo', messagesController.getPhoto);

module.exports = messagesRouter;
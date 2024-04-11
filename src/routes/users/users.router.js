const express = require('express');

const { 
  findAll,
  findOne,
  create,
  update,
  deleteOne
} = require('./users.controller');

const usersRouter = express.Router();

usersRouter.get('/', findAll);
usersRouter.get('/:id', findOne);
usersRouter.post('/', create);
usersRouter.put('/', update);
usersRouter.delete('/', deleteOne);

module.exports = usersRouter;
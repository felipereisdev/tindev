import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import socketIo from 'socket.io';
import http from 'http';
import cors from 'cors';

import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.database();
    this.websocket();
    this.middlewares();
    this.routes();
  }

  database() {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  websocket() {
    const io = socketIo(this.server);

    const connectedUsers = {};

    io.on('connection', socket => {
      const { user } = socket.handshake.query;

      connectedUsers[user] = socket.id;
    });

    this.app.use((req, res, next) => {
      req.io = io;
      req.connectedUsers = connectedUsers;

      return next();
    });
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;

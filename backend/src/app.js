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

    io.on('connection', socket => {
      console.log('Nova Conexão', socket.id);
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

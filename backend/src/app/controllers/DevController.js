import axios from 'axios';

import Dev from '../models/Dev';

class DevController {
  async index(req, res) {
    const { user } = req.headers;

    if (!user) {
      return res.status(400).json({ error: 'Logged user was not passed' });
    }

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    });

    return res.json(users);
  }

  async store(req, res) {
    const { github_username: user } = req.body;

    const devExists = await Dev.findOne({ user });

    if (devExists) {
      return res.json(devExists);
    }

    const response = await axios.get(`http://api.github.com/users/${user}`);

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user,
      bio,
      avatar,
    });

    return res.json(dev);
  }
}

export default new DevController();

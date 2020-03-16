import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Container, MatchContainer } from './styles';

import logo from '../../assets/logo.svg';
import like from '../../assets/like.svg';
import dislike from '../../assets/dislike.svg';
import itsamatch from '../../assets/itsamatch.png';

export default function Main({ match }) {
  const { id: loggedUserId } = match.params;

  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: loggedUserId,
        },
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [loggedUserId]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      query: { user: loggedUserId },
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [loggedUserId]);

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: loggedUserId },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: loggedUserId },
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>

      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />

              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={dislike} alt="Dislike" />
                </button>

                <button type="button" onClick={() => handleLike(user._id)}>
                  <img src={like} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Você já interagiu com todos os usuários :(</div>
      )}

      {matchDev && (
        <MatchContainer>
          <img src={itsamatch} alt="It's a match" />
          <img src={matchDev.avatar} alt={matchDev.name} className="avatar" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(null)}>
            FECHAR
          </button>
        </MatchContainer>
      )}
    </Container>
  );
}

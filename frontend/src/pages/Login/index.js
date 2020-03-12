import React, { useState } from 'react';

import api from '../../services/api';

import logo from '../../assets/logo.svg';

import { Container } from './styles';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username: username,
    });

    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev" />
        <input
          placeholder="Digite seu usuário no Github"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </Container>
  );
}

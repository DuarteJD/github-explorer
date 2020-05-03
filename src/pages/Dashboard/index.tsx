import React, { useState, FormEvent, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Switch from 'react-switch';

import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { shade } from 'polished';
import { useToast } from '../../hooks/toast';
import { Theme } from '../../hooks/useTheme';
import Api from '../../services/api';
import usePersistedState from '../../hooks/usePersistedState';

import logoLight from '../../assets/logo.svg';
import logoDark from '../../assets/logo-dark.svg';

import {
  Title,
  Form,
  Repositories,
  Error,
  Header,
  HeaderSwitcher,
} from './styles';

interface Message {
  limit: string;
  remaining: string;
}

interface Repository {
  full_name: string;
  description: string;
  type: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitUser {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
  location: string;
  bio: string;
  public_repos: number;
  type: string;
}

const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { toggleTheme } = useContext(Theme);
  const { colors, title } = useContext(ThemeContext);
  const [inputRepositorio, setInputRepositorio] = useState('');
  const [repositories, setRepositories] = usePersistedState<Repository[]>(
    '@GithubExplorer:Repositories',
    [],
  );
  const [users, setUsers] = usePersistedState<GitUser[]>(
    '@GithubExplorer:Users',
    [],
  );

  const [inputError, setInputError] = useState('');

  function messageAlert({ limit, remaining }: Message): void {
    const percent = (Number(remaining) / Number(limit)) * 100;

    if (percent === 50) {
      addToast({
        title: 'Uso da api',
        type: 'info',
        description:
          'Você atingiu 50% do limite máximo estabelecido para uso da Api!',
      });
      return;
    }

    if (percent === 25) {
      addToast({
        title: 'Uso da api',
        type: 'info',
        description:
          'Você atingiu 75% do limite máximo estabelecido para uso da Api!',
      });
      return;
    }

    if (Number(limit) === Number(remaining)) {
      addToast({
        title: 'Uso da api',
        type: 'error',
        description:
          'Você atingiu 100% do limite máximo estabelecido para uso da Api!',
      });
    }
  }

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!inputRepositorio) {
      addToast({
        title: 'Falta informações',
        type: 'info',
        description:
          'Você pode digitar um repositório ou o nome de um usuário ;)',
      });
      setInputError('Digite o autor/nome do repositório ou o nome do usuário!');
      return;
    }

    try {
      const split = inputRepositorio.split('/');
      if (split.length > 1) {
        const response = await Api.get<Repository>(`repos/${inputRepositorio}`);

        messageAlert({
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining'],
        });
        setRepositories([...repositories, response.data]);
        setInputRepositorio('');
        setInputError('');
      } else {
        const response = await Api.get<GitUser>(`users/${inputRepositorio}`);

        messageAlert({
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining'],
        });
        setUsers([...users, response.data]);
        setInputRepositorio('');
        setInputError('');
      }
    } catch (error) {
      // setInputError('Erro na busca pelo repositório/usuário informado!');
      addToast({
        title: 'Erro na requisição',
        type: 'error',
        description: 'Erro na busca pelo repositório/usuário informado!',
      });
    }
  }

  return (
    <>
      <Header>
        <img
          src={title === 'dark' ? logoDark : logoLight}
          alt="Github explorer"
        />
        <HeaderSwitcher>
          <Switch
            onChange={toggleTheme}
            checked={title === 'dark'}
            checkedIcon={false}
            uncheckedIcon={false}
            height={10}
            width={40}
            handleDiameter={20}
            offColor={shade(0.15, colors.offcolor)}
            onColor={colors.oncolor}
          />
          <strong>{title}</strong>
        </HeaderSwitcher>
      </Header>

      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          placeholder="Digite o nome do repositório ou nome do usuário"
          value={inputRepositorio}
          onChange={e => setInputRepositorio(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
        {users.map(user => (
          <Link key={user.id} to={`/user/${user.login}`}>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <strong>{user.name}</strong>
              <p>{user.bio}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;

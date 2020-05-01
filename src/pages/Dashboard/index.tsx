import React, { useState, FormEvent, useEffect, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import Switch from 'react-switch';

import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { shade } from 'polished';
import Api from '../../services/api';

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

interface Props {
  toggleTheme(): void;
}

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC<Props> = prevProps => {
  const { colors, title } = useContext(ThemeContext);
  const [inputRepositorio, setInputRepositorio] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithubExplorer:Repositories',
    );
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }

    return [];
  });
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:Repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!inputRepositorio) {
      setInputError('Digite o autor/nome do repositório!');
      return;
    }

    try {
      const response = await Api.get<Repository>(`repos/${inputRepositorio}`);
      setRepositories([...repositories, response.data]);
      setInputRepositorio('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca pelo repositório informado!');
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
            onChange={prevProps.toggleTheme}
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
          placeholder="Digite o nome do repositório"
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
      </Repositories>
    </>
  );
};

export default Dashboard;

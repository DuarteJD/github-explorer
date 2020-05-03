import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components';
import Switch from 'react-switch';

import { FiChevronRight, FiStar } from 'react-icons/fi';
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
  RepositoriesChild,
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
  updated_at: Date;
  isNew: boolean;
  isFavorite: boolean;
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
  updated_at: Date;
  isFavorite: boolean;
  isNew: boolean;
}

const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { toggleTheme } = useContext(Theme);
  const { colors, title } = useContext(ThemeContext);
  const [inputRepositorio, setInputRepositorio] = useState('');
  const [repositoriesOld, setRepositoriesOld] = usePersistedState<Repository[]>(
    '@GithubExplorer:Repositories',
    [],
  );
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [usersOld, setUsersOld] = usePersistedState<GitUser[]>(
    '@GithubExplorer:Users',
    [],
  );
  const [users, setUsers] = useState<GitUser[]>([]);

  useEffect(() => {
    async function verifyRepoNews(): Promise<void> {
      try {
        // Coloquei todos os repositórios que estou seguindo dentro de uma promise;
        const promisesRepo = repositoriesOld.map(async repository =>
          Api.get<Repository>(`repos/${repository.full_name}`),
        );

        // Executando todas as promises de uma vez só
        const result = await Promise.all(promisesRepo);

        // Criei um novo array para não adicionar uma nova dependência dentro do UseEffect
        const newRepositories: Repository[] = [];

        /**
         * Percorrendo o resultado de todas as promises com os dados atualizados do Repositórios
         * Aqui irei comparar as datas de atualização e popular o array
         * */
        result.map((r, i) =>
          newRepositories.push({
            ...r.data,
            isFavorite: true,
            isNew: repositoriesOld[i].updated_at !== r.data.updated_at,
          }),
        );
        // Agora irei atualizar o localStorage com as informações atualizadas do(s) repositório(s)
        localStorage.setItem(
          '@GithubExplorer:Repositories',
          JSON.stringify(newRepositories),
        );

        // Setando a variável que abaixo será responsável por listar os repositórios favoritos
        setRepositories(newRepositories);
      } catch (error) {
        addToast({
          title: 'Erro na requisição',
          type: 'error',
          description: 'Erro ao buscar informações do diretório!',
        });
      }
    }

    verifyRepoNews();
  }, [repositoriesOld, addToast]);

  useEffect(() => {
    async function verifyUserNews(): Promise<void> {
      try {
        // Coloquei todos os users que estou seguindo dentro de uma promise;
        const promisesUsers = usersOld.map(async user =>
          Api.get<GitUser>(`users/${user.login}`),
        );

        // Executando todas as promises de uma vez só
        const result = await Promise.all(promisesUsers);

        // Criei um novo array para não adicionar uma nova dependência dentro do UseEffect
        const newUsers: GitUser[] = [];

        /**
         * Percorrendo o resultado de todas as promises com os dados atualizados do Usuário
         * Aqui irei comparar as datas de atualização e popular o array
         * */
        result.map((r, i) =>
          newUsers.push({
            ...r.data,
            isFavorite: true,
            isNew: usersOld[i].public_repos !== r.data.public_repos,
          }),
        );
        // Agora irei atualizar o localStorage com as informações atualizadas do(s) usuario(s)
        localStorage.setItem('@GithubExplorer:Users', JSON.stringify(newUsers));

        // Setando a variável que abaixo será responsável por listar os usuários favoritos
        setUsers(newUsers);
      } catch (error) {
        addToast({
          title: 'Erro na requisição',
          type: 'error',
          description: 'Erro ao buscar informações do usuário!',
        });
      }
    }

    verifyUserNews();
  }, [addToast]);

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

    if (Number(remaining) === 0) {
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
        const indexRepo = repositories.findIndex(
          r => r.full_name === inputRepositorio,
        );

        if (indexRepo >= 0) {
          addToast({
            title: 'Informação',
            type: 'info',
            description:
              'Você já possui este repositório na lista atual! \n ;)',
          });
          return;
        }

        const response = await Api.get<Repository>(`repos/${inputRepositorio}`);

        messageAlert({
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining'],
        });
        setRepositories([
          ...repositories,
          { ...response.data, isFavorite: false, isNew: false },
        ]);
        setInputRepositorio('');
        setInputError('');
      } else {
        const indexUser = users.findIndex(r => r.login === inputRepositorio);

        if (indexUser >= 0) {
          addToast({
            title: 'Informação',
            type: 'info',
            description: 'Você já possui este usuário na lista atual! \n ;)',
          });
          return;
        }
        const response = await Api.get<GitUser>(`users/${inputRepositorio}`);

        messageAlert({
          limit: response.headers['x-ratelimit-limit'],
          remaining: response.headers['x-ratelimit-remaining'],
        });
        setUsers([
          ...users,
          { ...response.data, isNew: false, isFavorite: false },
        ]);
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
        {repositories.map((repository, index) => (
          <RepositoriesChild
            key={repository.full_name}
            hasNews={repository.isNew}
            hasLiked={repository.isFavorite}
          >
            <button
              type="button"
              onClick={() => {
                if (repository.isFavorite) {
                  // Remover
                  const dislike = repository.full_name;
                  const repositoryIndex = repositoriesOld.findIndex(
                    r => r.full_name === dislike,
                  );

                  if (repositoryIndex >= 0) {
                    const newLikedRepository = repositoriesOld.filter(
                      r => r.full_name !== dislike,
                    );
                    setRepositoriesOld(newLikedRepository);

                    const newRepositories = repositories.filter(
                      r => r.full_name !== dislike,
                    );
                    setRepositories(newRepositories);
                  } else {
                    addToast({
                      title: 'Registro não encontrado!',
                      type: 'error',
                      description: `Não encontrei o registro ${repository.full_name}!`,
                    });
                  }
                } else {
                  setRepositoriesOld([...repositoriesOld, repository]);
                  repositories[index].isFavorite = true;
                }
              }}
            >
              <FiStar size={26} />
            </button>
            <Link to={`/repository/${repository.full_name}`}>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <span>
                  {` [ ${new Date(
                    repository.updated_at,
                  ).toLocaleDateString()} - ${new Date(
                    repository.updated_at,
                  ).toLocaleTimeString()}]`}
                </span>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          </RepositoriesChild>
        ))}
        {users.map((user, index) => (
          <RepositoriesChild
            key={user.id}
            hasNews={user.isNew}
            hasLiked={user.isFavorite}
          >
            <button
              type="button"
              onClick={() => {
                if (users[index].isFavorite) {
                  // Remover
                  const dislike = users[index].login;
                  const userIndex = usersOld.findIndex(
                    u => u.login === dislike,
                  );

                  if (userIndex >= 0) {
                    const newLikedUsers = usersOld.filter(
                      u => u.login !== dislike,
                    );
                    setUsersOld(newLikedUsers);

                    const newUsers = users.filter(u => u.login !== dislike);
                    setUsers(newUsers);
                  } else {
                    addToast({
                      title: 'Registro não encontrado!',
                      type: 'error',
                      description: `Não encontrei o registro ${user.login}!`,
                    });
                  }
                } else {
                  setUsersOld([...usersOld, users[index]]);
                  users[index].isFavorite = true;
                }
              }}
            >
              <FiStar size={26} />
            </button>
            <Link to={`/user/${user.login}`}>
              <img src={user.avatar_url} alt={user.name} />
              <div>
                <strong>{user.name}</strong>
                <span>
                  {` [ ${user.public_repos}`}
                  {' repositórios ]'}
                </span>
                <p>{user.bio}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          </RepositoriesChild>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;

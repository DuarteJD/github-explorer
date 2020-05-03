import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { useToast } from '../../hooks/toast';
import usePersistedState from '../../hooks/usePersistedState';
import Api from '../../services/api';

import logoLight from '../../assets/logo.svg';
import logoDark from '../../assets/logo-dark.svg';

import {
  Header,
  RepositoryInfo,
  Repositories,
  RepositoriesChild,
} from './styles';

interface Params {
  user: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: Date;
  isNew: boolean;
  isFavorite: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitUser {
  id: string;
  name: string;
  avatar_url: string;
  location: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  type: string;
}

const User: React.FC = () => {
  const { addToast } = useToast();
  const { title } = useContext(ThemeContext);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [gitUser, setGitUser] = useState<GitUser>({} as GitUser);
  const [repositoriesOld, setRepositoriesOld] = usePersistedState<Repository[]>(
    '@GithubExplorer:Repositories',
    [],
  );

  const { params } = useRouteMatch<Params>();

  useEffect(() => {
    Api.get<Repository[]>(
      `users/${params.user}/repos?type=owner&sort=updated`,
    ).then(response => {
      // Vou criar um array contendo os repositórios já com a nova informação
      const fullRepositories: Repository[] = [];

      // Vou ler os repositórios atuais para verificar se já curti algum
      response.data.map(repository => {
        const indexRepo = repositoriesOld.findIndex(
          r => r.full_name === repository.full_name,
        );
        if (indexRepo >= 0) {
          const newRepo: Repository = repository;
          newRepo.isFavorite = true;
          newRepo.isNew = false;
          fullRepositories.push(newRepo);
        } else {
          fullRepositories.push(repository);
        }
        return true;
      });

      // Agora sim vou preencher a variável que é exibida em tela já com as informações se já curti ou não um repo;
      setRepositories(fullRepositories);
    });

    Api.get(`users/${params.user}`).then(response => {
      setGitUser(response.data);
    });
  }, [params.user]);

  return (
    <>
      <Header>
        <img
          src={title === 'dark' ? logoDark : logoLight}
          alt="Github Explorer"
        />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {gitUser && (
        <RepositoryInfo>
          <header>
            <img src={gitUser.avatar_url} alt={gitUser.name} />
            <div>
              <strong>{gitUser.name}</strong>
              <p>{gitUser.bio}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{gitUser.public_repos}</strong>
              <span>Repositórios</span>
            </li>
            <li>
              <strong>{gitUser.followers}</strong>
              <span>Seguidores</span>
            </li>
            <li>
              <strong>{gitUser.following}</strong>
              <span>Seguindo</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      {repositories && (
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
                      // Aqui já irá salvar no localStorage a informação atualizada;
                      setRepositoriesOld(newLikedRepository);

                      // Agora só preciso atualizar a informação no array temporário que irá alterar o like do repo
                      repositories[index].isFavorite = false;
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
        </Repositories>
      )}
    </>
  );
};

export default User;

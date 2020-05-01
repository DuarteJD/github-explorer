import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import Api from '../../services/api';

import logoLight from '../../assets/logo.svg';
import logoDark from '../../assets/logo-dark.svg';

import { Header, RepositoryInfo, Repositories } from './styles';

interface Params {
  user: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
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
  const { title } = useContext(ThemeContext);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [gitUser, setGitUser] = useState<GitUser>({} as GitUser);

  const { params } = useRouteMatch<Params>();

  useEffect(() => {
    Api.get(`users/${params.user}/repos?type=owner&sort=updated`).then(
      response => {
        setRepositories(response.data);
      },
    );

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
      )}
    </>
  );
};

export default User;

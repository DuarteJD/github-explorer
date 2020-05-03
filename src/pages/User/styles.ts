import styled, { css } from 'styled-components';

interface LinkProps {
  hasNews?: boolean;
  hasLiked?: boolean;
}

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #a8a8b3;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }

    svg {
      margin-right: 4px;
    }
  }
`;

export const RepositoryInfo = styled.section`
  margin-top: 80px;

  header {
    display: flex;
    align-items: center;

    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }

    div {
      margin-left: 24px;

      strong {
        font-size: 36px;
        color: ${props => props.theme.colors.text};
      }

      p {
        font-size: 18px;
        color: ${props => props.theme.colors.text};
        margin-top: 4px;
      }
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin-top: 40px;

    li {
      & + li {
        margin-left: 80px;
      }
      strong {
        display: block;
        font-size: 36px;
        color: ${props => props.theme.colors.text};
      }

      span {
        display: block;
        color: ${props => props.theme.colors.text};
        margin-left: 4px;
      }
    }
  }
`;

export const Repositories = styled.div`
  margin-top: 80px;
  max-width: 700px;
`;

export const RepositoriesChild = styled.div<LinkProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.oncolor};
  border-radius: 5px;
  width: 100%;
  padding: 20px;
  margin-top: 6px;

  button {
    background: transparent;
    border: none;
    margin-right: 20px;

    svg {
      margin-left: auto;
      color: ${props =>
        props.hasLiked ? props.theme.colors.borderNews : '#a8a8b3'};

      transition: background-color 0.2s;

      &:hover {
        color: ${props =>
          props.hasLiked ? '#a8a8b3' : props.theme.colors.borderNews};
      }
    }
  }

  ${props =>
    props.hasNews &&
    css`
      border: 4px solid ${props.theme.colors.borderNews};
    `};

  a {
    display: flex;
    align-items: center;

    text-decoration: none;
    width: 100%;

    transition: transform 0.2s;
    &:hover {
      transform: translateX(10px);
    }

    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    div {
      margin: 0 16px;
      flex: 1;

      strong {
        font-size: 20px;
        color: ${props => props.theme.colors.offcolor};
      }

      span {
        font-size: 12px;
        color: #a8a8b3;
      }

      p {
        font-size: 18px;
        color: #a8a8b3;
        margin-top: 4px;
      }
    }

    svg {
      margin-left: auto;
      color: ${props => props.theme.colors.offcolor};
      transition: background-color 0.2s;

      &:hover {
        color: ${props => props.theme.colors.borderNews};
      }
    }
  }
`;

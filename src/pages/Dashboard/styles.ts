import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface FormProps {
  hasError: boolean;
}

interface LinkProps {
  hasNews?: boolean;
  hasLiked?: boolean;
}

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  strong {
    margin-left: 5px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
  }
`;

export const Title = styled.h1`
  font-size: 48px;
  color: ${props => props.theme.colors.text};
  max-width: 450px;
  line-height: 56px;

  margin-top: 80px;
`;

export const Form = styled.form<FormProps>`
  margin-top: 40px;
  max-width: 700px;

  display: flex;

  input {
    flex: 1;
    height: 70px;
    padding: 0 24px;
    border: 0;
    border-radius: 5px 0 0 5px;
    color: ${props => props.theme.colors.offcolor};
    background-color: ${props => props.theme.colors.oncolor};
    border: 2px solid ${props => props.theme.colors.oncolor};
    border-right: 0;

    ${props =>
      props.hasError &&
      css`
        border-color: ${props.theme.colors.inputError};
      `}

    &::placeholder {
      color: #a8a8b3;
    }
  }

  button {
    width: 210px;
    height: 70px;
    background: #04d361;
    border: 0;
    border-radius: 0 5px 5px 0px;
    color: #fff;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#04d361')};
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

export const Error = styled.span`
  display: block;
  color: ${props => props.theme.colors.inputError};
  margin-top: 6px;
  margin-left: 6px;
`;

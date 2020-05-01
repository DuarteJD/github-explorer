import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      oncolor: string;
      offcolor: string;

      background: string;
      text: string;
    };
  }
}

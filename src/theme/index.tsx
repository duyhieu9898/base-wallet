import React, { useContext, useMemo } from 'react';
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeContext,
} from 'styled-components';
import { Text, TextProps } from 'rebass';
import { AlertTriangle } from 'react-feather';
import { Colors, Properties } from './styled';
// // @ts-ignore
// import BackgroundImg from '../assets/images/bg.png';

export * from './components';

// upToSmall | upFromSmall
const MEDIA_WIDTHS = {
  ExtraSmall: 500,
  Small: 600,
  Medium: 960,
  Large: 1280,
};

const ALL_TYPE_OF_MEDIA_WIDTHS = [
  'upToExtraSmall',
  'upToSmall',
  'upToMedium',
  'upToLarge',
  'upFromExtraSmall',
  'upFromSmall',
  'upFromMedium',
  'upFromLarge',
];

const mediaWidthTemplates: {
  [width in typeof ALL_TYPE_OF_MEDIA_WIDTHS[number]]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[`upTo${size}`] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  (accumulator as any)[`upFrom${size}`] = (a: any, b: any, c: any) => css`
    @media (min-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

const white = '#FFFFFF';
const black = '#000000';

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#FFFFFF',
    text2: '#abb2c8',
    text3: '#6C7284',
    text4: '#565A69',
    text6: '#f6f6f6',
    text7: '#565A69',
    highlightText1: '#17FF90',
    textContrast1: '#11131b' ,

    // backgrounds / greys
    bg0: '#242735',
    bg1: '#17192d',
    bg2: '#242741',
    bg3: '#3a3f50',
    bg4: '#474f69',

    //specialty colors
    sidebar: '#11131b',
    modalOverlay: 'rgba(0, 0, 0, 0.55)',
    modalBG: '#242735',
    advancedBG: '#1e2431',
    cardBG: '#242735',
    cardBG2: '#1e2139',
    borderColor: '#3a3f50',
    borderColor2:'#4354a4',
    borderHover:'#3c437e',
    tooltipBG: '#262c3a',
    headerOverlay: 'rgba(255,255,255,0.08)',
    inputBG:'#121530',
    selectionBG: 'transparent',

    // button colors
    primaryButtonBG: '#3680E7',
    primaryButtonColor: '#fff',
    secondaryButtonBG: '#F7931A',
    primaryButtonBG2: '#272367',

    //primary colors
    primary1: '#43d2ff' ,
    primary2:'#3680E7' ,
    primary3: '#9ec3d6' ,
    primary4:  '#376bad70' ,
    primary5:  '#153d6f70' ,

    primaryDarken1: '#43d2ff',

    // color text
    primaryText2: '#3d7f9b',

    // secondary colors
    secondary1: '#F7931A' ,
    secondary2: '#17000b26' ,
    secondary3:  '#17000b26' ,

    // other
    red1: '#FF7373',
    green1: '#17FF90',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    error: '#e56b73',
    warning: '#F7931A',
    secondaryColor: '#17FF90',
    text: '#fafafa',
    darkGray: '#a7a7a7',
    headerColor: '#ffffff',
    subTextColor: '#ABB2C8',
  };
}

const BoxSpacingCss = css`
  margin-top: ${({ mt, my, ma }: any) => mt ?? my ?? ma ?? ''};
  margin-right: ${({ mr, mx, ma }: any) => mr ?? mx ?? ma ?? ''};
  margin-bottom: ${({ mb, my, ma }: any) => mb ?? my ?? ma ?? ''};
  margin-left: ${({ ml, mx, ma }: any) => ml ?? mx ?? ma ?? ''};

  padding-top: ${({ pt, py, pa }: any) => pt ?? py ?? pa ?? ''};
  padding-right: ${({ pr, px, pa }: any) => pr ?? px ?? pa ?? ''};
  padding-bottom: ${({ pb, py, pa }: any) => pb ?? py ?? pa ?? ''};
  padding-left: ${({ pl, px, pa }: any) => pl ?? px ?? pa ?? ''};
`;

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    dark: darkMode,
    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? '#000' : '#52b141',

    // media queries
    // @ts-ignore
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
    flexRowWrap: css`
      display: flex;
      flex-flow: row wrap;
    `,
    boxSpacing: BoxSpacingCss,
  };
}

export const themeProperties: Properties = {
  defaultRadius: '4px',
  paddingCard: '20px',
  halfPaddingCard: '10px',
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const darkMode = false; // useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

const TextWrapper = styled(({ color, ...rest }) => {
  const _theme = useContext(ThemeContext);
  const _color = (_theme as any)[color] || color;
  return <Text {...rest} color={_color} />;
})<{ cursor?: string }>`
  cursor: ${({ cursor }) => cursor};
`;

interface TypeNumberProps {
  value: number;
  formatted: string | React.ReactNode;
  color?: string;
  [x: string]: any;
}

export const TYPE = {
  text(props: TextProps) {
    return <TextWrapper {...props} />;
  },
  main(props: TextProps) {
    return <TextWrapper color={'text1'} {...props} />;
  },
  label(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />;
  },
  buttonText(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        color={'primaryDarken1'}
        cursor={'pointer'}
        {...props}
      />
    );
  },
  bold(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />;
  },
  body(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
    );
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />;
  },
  italic(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={12}
        fontStyle={'italic'}
        color={'text2'}
        {...props}
      />
    );
  },
  error({
    error = true,
    hasIcon = true,
    children,
    ...props
  }: { error?: boolean; hasIcon?: boolean } & TextProps) {
    return (
      <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props}>
        {hasIcon ? (
          <AlertTriangle size={'16px'} style={{ marginRight: '5px' }} />
        ) : null}
        {children}
      </TextWrapper>
    );
  },
  button(props: TextProps) {
    return <TextWrapper fontWeight={700} fontSize={20} {...props} />;
  },
  warning(props: TextProps) {
    return <TextWrapper fontWeight={400} color={'secondary1'} {...props} />;
  },
  highlight(props: TextProps) {
    return <TextWrapper color={'highlightText1'} {...props} />;
  },
  number({ value, formatted, color, ...props }: TypeNumberProps) {
    return (
      <TextWrapper {...props} color={value === 0 ? 'text2' : color || 'text1'}>
        {formatted}
      </TextWrapper>
    );
  },
};

export const FixedGlobalStyle = createGlobalStyle`
  html, input, textarea, button {
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.018em;
    font-display: fallback;
  }

  @supports (font-variation-settings: normal) {
    html, input, textarea, button {
      font-family: 'Inter var', sans-serif;
    }
  }

  * {
    box-sizing: border-box;
  }

  button {
    user-select: none;
  }

  html {
    font-size: 16px;
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
`;

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
  }
`;

export const SUPPORTED_THEMES = function() {
  return [];
};

export const valueStyles = {
  defaultRadius: '6px',
};

export const elementStyles = {
  defaultBorder: {
    border: '1px solid ' + colors(true).borderColor,
    borderRadius: valueStyles.defaultRadius,
  },
  wrappedBox: {
    border: '1px solid ' + colors(true).borderColor,
    borderRadius: valueStyles.defaultRadius,
    // boxShadow: '0px 2px 4px 2px #151923',
    padding: '12px',
  },
  wrappedNewBox: {
    borderRadius: valueStyles.defaultRadius,
    // boxShadow: '0px 2px 4px 2px #151923',
    padding: '12px',
  },
};

export const commonStyles = {
  hightLight: {
    color: '#F7931A',
  },
  meta: {
    opacity: '0.7',
  },
};

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Gilroy";
    font-weight: 400;
    src: local("Gilroy-Regular"), local("Gilroy-Normal"), url(${require('../assets/fonts/Gilroy-Regular.otf')}) format("opentype");
    font-display: swap;
  }
  @font-face {
    font-family: "Gilroy";
    font-weight: 500;
    src: local("Gilroy-Medium"), url(${require('../assets/fonts/Gilroy-Medium.otf')}) format("opentype");
    font-display: swap;
  }
  @font-face {
    font-family: "Gilroy";
    font-weight: 600;
    src: local("Gilroy-SemiBold"), url(${require('../assets/fonts/Gilroy-Semibold.otf')}) format("opentype");
    font-display: swap;
  }
  @font-face {
    font-family: "Gilroy";
    font-weight: 700;
    src: local("Gilroy-Bold"), url(${require('../assets/fonts/Gilroy-Bold.otf')}) format("opentype");
    font-display: swap;
  }

  body {
    font-family: "Gilroy", "Roboto", sans-serif;
    font-size: 16px;
    font-weight: 400;
    height: 100vh;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg0};
    margin: 0;
    padding: 0;
  }
  button {
    font-family: "Gilroy", "Roboto", sans-serif;
  }
`;

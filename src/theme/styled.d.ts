import {
  FlattenSimpleInterpolation,
  ThemedCssFunction,
} from 'styled-components';

export type Color = string;
export interface Colors {
  // base
  white: Color;
  black: Color;

  // text
  text1: Color;
  text2: Color;
  text3: Color;
  text4: Color;
  text6: Color;
  text7: Color;
  highlightText1: Color;
  textContrast1: Color;

  // backgrounds / greys
  bg0: Color;
  bg1: Color;
  bg2: Color;
  bg3: Color;
  bg4: Color;

  sidebar: Color;
  modalOverlay: Color;
  modalBG: Color;
  advancedBG: Color;
  cardBG: Color;
  cardBG2: Color;
  borderColor: Color;
  borderColor2: Color;
  borderHover: Color;
  tooltipBG: Color;
  headerOverlay: Color;
  inputBG: Color;
  selectionBG: Color;

  primaryButtonBG: Color;
  primaryButtonColor: Color;
  secondaryButtonBG: Color;
  primaryButtonBG2: Color;

  //blues
  primary1: Color;
  primary2: Color;
  primary3: Color;
  primary4: Color;
  primary5: Color;
  primaryDarken1: Color;

  primaryText2: Color;
  // pinks
  secondary1: Color;
  secondary2: Color;
  secondary3: Color;

  // other
  red1: Color;
  green1: Color;
  yellow1: Color;
  yellow2: Color;

  text: Color;
  darkGray: Color;
  headerColor: Color;
  subTextColor: Color;
  error: Color;
  warning: Color;
  secondaryColor: Color;
}

export interface Properties {
  defaultRadius: string;
  paddingCard: string;
  halfPaddingCard: string;
}

export interface Grids {
  sm: number;
  md: number;
  lg: number;
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    dark: boolean;
    grids: Grids;

    // shadows
    shadow1: string;

    // media queries
    mediaWidth: {
      // down
      upToExtraSmall: ThemedCssFunction<DefaultTheme>;
      upToSmall: ThemedCssFunction<DefaultTheme>;
      upToMedium: ThemedCssFunction<DefaultTheme>;
      upToLarge: ThemedCssFunction<DefaultTheme>;
      // up
      upFromExtraSmall: ThemedCssFunction<DefaultTheme>;
      upFromSmall: ThemedCssFunction<DefaultTheme>;
      upFromMedium: ThemedCssFunction<DefaultTheme>;
      upFromLarge: ThemedCssFunction<DefaultTheme>;
    };

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation;
    flexRowNoWrap: FlattenSimpleInterpolation;
    flexRowWrap: FlattenSimpleInterpolation;

    boxSpacing: any;
  }
}

export interface BoxSpacingProps {
  // margin
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  mx?: string | number;
  my?: string | number;
  ma?: string | number;
  // padding
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  px?: string | number;
  py?: string | number;
  pa?: string | number;
}

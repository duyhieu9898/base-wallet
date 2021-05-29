import React, { useState } from 'react';
import { HelpCircle } from 'react-feather';
import { ImageProps } from 'rebass';
import styled, { css } from 'styled-components';
import LazyLoad from 'react-lazyload';

const Image = styled.img<{ background?: string }>`
  border-radius: 100%;
  ${({ background }) =>
    background &&
    css`
      background: ${background};
      // padding: 1px;
    `}
`;

const HelpCircleStyled = styled(HelpCircle)`
  border-radius: 100%;
  background-color: ${({ theme }) => theme.bg0};
`;

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export interface CurrencyLogoLazyProps {
  lazy?: boolean;
  lazyProps?: any;
}

export interface LogoProps
  extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[];
  background?: string;
  [x: string]: any;
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({
  srcs,
  alt,
  background,
  lazy,
  lazyProps = {},
  ...rest
}: LogoProps & CurrencyLogoLazyProps) {
  const [, refresh] = useState<number>(0);

  let src: string | undefined = '';
  try {
    src = srcs.find(src => !BAD_SRCS[src]);
  } catch (e) {}

  if (src) {
    const renderImage = () => {
      return (
        <Image
          {...rest}
          alt={alt}
          src={src}
          background={background}
          onError={() => {
            if (src) BAD_SRCS[src] = true;
            refresh(i => i + 1);
          }}
        />
      );
    };
    if (lazy) {
      return <LazyLoad {...lazyProps}>{renderImage()}</LazyLoad>;
    }
    return renderImage();
  }

  return <HelpCircleStyled {...rest} color={'#C3C5CB'} />;
}

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { animated, useTransition, useSpring } from 'react-spring';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { isMobile } from 'react-device-detect';
import '@reach/dialog/styles.css';
import { transparentize } from 'polished';
import { useGesture } from 'react-use-gesture';
import { CloseIcon } from '../../theme';

const AnimatedDialogOverlay = animated(DialogOverlay);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(({ iOS, ...props }) => (
  <AnimatedDialogOverlay {...props} />
))<{ iOS?: boolean }>`
  &[data-reach-dialog-overlay] {
    z-index: 1220; // index of menu 1200
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalOverlay ?? 'transparent'};
  }
  ${({ iOS }) =>
    !iOS &&
    css`
      * {
        &::-webkit-scrollbar {
          width: 8px;
          background: rgba(26, 26, 26, 0.4);
          &:horizontal {
            height: 8px;
          }
        }
        &::-webkit-scrollbar-track {
          &,
          &:horizontal {
            -webkit-border-radius: 10px;
            border-radius: 10px;
          }
        }
        &::-webkit-scrollbar-thumb {
          &,
          &:horizontal {
            -webkit-border-radius: 10px;
            border-radius: 10px;
            background: #999;
          }
        }
      }
    `}
`;

const AnimatedDialogContent = animated(DialogContent);
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(
  ({ bordered, maxWidth, minHeight, maxHeight, mobile, isOpen, ...rest }) => (
    <AnimatedDialogContent {...rest} />
  )
).attrs({
  'aria-label': 'dialog',
})`
  &[data-reach-dialog-content] {
    position: relative;
    margin: 0 0 2rem 0;
    ${({ bordered }) =>
      bordered &&
      css`
        border: 1px solid ${({ theme }) => theme.borderColor};
      `}
    background-color: ${({ theme }) => theme.modalBG};
    box-shadow: 0 4px 8px 0
      ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 50vw;
    overflow: auto; // hidden;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

    max-width: ${({ maxWidth }) => maxWidth ?? '420px'};
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width: 85vw;
      ${mobile &&
        css`
          width: 100vw;
          border-radius: 20px 20px 0 0;
        `}
    `}
  }
`;

const CloseIconAbsolute = styled(CloseIcon)`
  position: absolute;
  top: 12px;
  right: 12px;
`;

interface ModalProps {
  isOpen: boolean;
  onDismiss?: () => void;
  maxWidth?: string;
  minHeight?: number | false;
  maxHeight?: number;
  initialFocusRef?: React.RefObject<any> | false;
  children?: React.ReactNode;
  bordered?: boolean;
  persistent?: boolean;
  closable?: boolean;
}

export default function Modal({
  isOpen,
  onDismiss = () => {},
  maxWidth,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children,
  bordered = true,
  persistent = true,
  closable,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [{ y }, set] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 210, friction: 20 },
  }));
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0,
      });
      if (
        state.movement[1] > 300 ||
        (state.velocity > 3 && state.direction[1] > 0)
      ) {
        onDismiss();
      }
    },
  });

  const _initialIOS = !!(
    navigator && navigator.userAgent.match(/iPhone|iPad|iPod/i)
  );
  const [iOS] = useState<boolean>(_initialIOS);

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              iOS={iOS}
              onDismiss={() => persistent && onDismiss()}
              initialFocusRef={initialFocusRef}
            >
              <StyledDialogContent
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.interpolate(
                          y => `translateY(${y > 0 ? y : 0}px)`
                        ),
                      },
                    }
                  : {})}
                aria-label="dialog content"
                maxWidth={maxWidth}
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
                bordered={bordered}
              >
                {closable ? <CloseIconAbsolute onClick={onDismiss} /> : null}
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
}

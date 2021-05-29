import styled, { keyframes } from 'styled-components';

// Variables
const _pufCount = 45;
export const variables: any = {
  debug: 0,
  animationTime: 3, // seconds
  pufSize: '7px',
  pufCount: _pufCount,
  intervalDegree: 360 / _pufCount,
  smokeRatioDisappear: '60%',
};

// keyframes
const keyframesOrbit = keyframes`
  0% {transform: rotate(0deg)}
  100% {transform: rotate(360deg)}
`;

const keyframesPufWhite = keyframes`
  0% {
    opacity: 1;
    color: rgba(0,0,0,0.75);
    transform: scale(1);
  }
  10% {
    color: rgba(255, 255, 255, 0.9);
    transform: scale(1.5);
  }
  ${variables.smokeRatioDisappear}, 100% {
    opacity: 0;
    color: rgba(0,0,0,0.3);
    transform: scale(0.4);
  }
`;

// Animation for particles (going down)
const keyframesParticle = keyframes`
  0% {
    opacity: 1;
    color: rgba(255,255,255, 1);
    margin-top: 0px;
  }
  10% {
    margin-top: 15px;
  }
  75% {
    opacity: 0.5;
    margin-top: 5px;
  }
  100% {
    opacity: 0;
    margin-top: 0px;
  }
`;

// Animation for particles (going up)
const keyframesParticleO = keyframes`
  0% {
    opacity: 1;
    color: rgba(255,255,255, 1);
    margin-top: 0px;
  }
  10% {
    margin-top: -7px;
  }
  75% {
    opacity: 0.5;
    margin-top: 0px;
  }
  100% {
    opacity: 0;
    margin-top: 0px;
  }
`;

/*---------------------------*/
/*-- Rocket Spinner Styles --*/
/*---------------------------*/
export const StyledLoader = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  display: block;
  margin: 0 auto;
  // transition: all 2s ease-out;
  // transform: scale(1);
  // &:hover {
  //   transition: all 1s ease-in;
  //   transform: scale(1.5);
  // }
  &:before {
    content: '';
    width: 40px
    height: 40px;
    position: absolute;
    top: 33px;
    left: 30px;
    background: url('${require('../../assets/images/transparent-logo.png')}') center no-repeat;
    background-size: contain;
  }
`;

// Loader icon styles
export const StyledLoaderIcon = styled.div`
  color: white;
  // color: transparent;
  // text-shadow: 0 0 5px rgba(255,255,255,0.99);
  text-align: center;
  width: 25px;
  height: 25px;
  line-height: 25px;
  margin: 0 auto;
  font-size: 26px;
  transform: rotate(45deg);
`;

// Animate the loader main icon (spin/orbit)
export const StyledLoaderSpinned = styled.div`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  position: absolute;
  display: block;
  animation: ${keyframesOrbit} ${variables.animationTime}s linear infinite;
`;

// Smoke
export const StyledPufs = styled.div`
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: block;
  position: absolute;
  > i {
    display: block;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    position: absolute;

    &:after {
      content: '';
      background-color: rgba(255, 255, 255, 0.4);
      height: ${variables.pufSize};
      width: ${variables.pufSize};
      position: relative;
      border-radius: 100%;
      display: block;
      margin: 0 auto;
      top: ${variables.pufSize};
      font-size: 9px;
      opacity: 0;

      animation-name: ${keyframesPufWhite};
      animation-iteration-count: infinite;
      animation-timing-function: ease-out;
      animation-duration: ${variables.animationTime}s;
    }
  }
`;

export const StyledPufI = styled.i<{ index: number; delay: number }>`
  &:nth-child(${({ index }) => index}) {
    transform: rotate(${({ index }) => index * variables.intervalDegree}deg);
    &:after {
      animation-delay: ${({ delay }) => delay}s;
      margin-top: ${({ index }) => (index % 2 === 0 ? '1px' : '-1px')};
    }
  }
`;

// Particles
export const StyledParticles = styled.div`
  position: absolute;
  display: block;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  > i {
    display: block;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    position: absolute;

    &:after {
      content: '\\f111';
      height: ${variables.pufSize};
      width: ${variables.pufSize};
      position: relative;
      border-radius: 100%;
      display: block;
      margin: 0 auto;
      top: ${variables.pufSize};
      font-size: 2px;
      opacity: 0; // INITIAL STATE
      margin-top: 0;

      animation-iteration-count: infinite;
      animation-timing-function: ease-out;
      animation-duration: ${variables.animationTime}s;
    }
  }
`;

export const StyledParticleI = styled.i<{ index: number; delay: number }>`
  &:nth-child(${({ index }) => index}) {
    transform: rotate(${({ index }) => index * variables.intervalDegree}deg);
    &:after {
      animation-delay: ${({ delay }) => delay}s;
      animation-name: ${({ index }) =>
        index % 3 === 0 ? keyframesParticle : keyframesParticleO};
    }
  }
`;

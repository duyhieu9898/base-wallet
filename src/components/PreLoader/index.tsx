import React from 'react';
import styled from 'styled-components';
import { Dots } from '../../theme';

const StyledDots = styled(Dots)`
  font-size: 1.35em;
  letter-spacing: 3px;
`;

const PreLoader = () => {
  return <StyledDots>Loading</StyledDots>;
};

export default PreLoader;

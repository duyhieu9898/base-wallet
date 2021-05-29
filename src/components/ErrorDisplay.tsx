import React from 'react';
import styled from 'styled-components';

const ErrorTextContainer = styled.div`
  font-family: var(--roboto);
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--error-color);
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ErrorTextContainerPlaceholder = styled.div`
  height: 28px;
`;

const ErrorDisplay = ({ errorText }) => {
  const ErrorTextElement = ({ errorText }) => {
    if (errorText) {
      return <ErrorTextContainer>{errorText}</ErrorTextContainer>;
    } else {
      return <ErrorTextContainerPlaceholder />;
    }
  };

  return <ErrorTextElement errorText={errorText} />;
};

export default ErrorDisplay;

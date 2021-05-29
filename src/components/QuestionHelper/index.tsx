import React from 'react';
import styled from 'styled-components';
import TooltipBase from '../Tooltip';
import { IconInfoCircle } from '../Common/Icons';

const StyledRoot = styled.div<{ display?: string }>`
  display: ${({ display }) => display ?? ''};
  margin-left: 4px;
  line-height: 1;
`;

const QuestionWrapper = styled.div<{ size?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  color: ${({ theme }) => theme.primary1};
  font-size: ${({ size }) => size ?? '20px'};

  :hover,
  :focus {
    opacity: 0.7;
  }
`;

interface QuestionHelperProps {
  text: string | React.ReactNode;
  size?: string;
  display?: string;
  style?: React.CSSProperties;
  color?: string;
  [attr: string]: any;
  onClose?: () => void;
}

export default function QuestionHelper({
  text,
  size = '15px',
  display = 'inline-flex',
  style = {},
  color,
  onClose,
  ...props
}: QuestionHelperProps) {
  // const [show, setShow] = useState<boolean>(false);
  //
  // const open = useCallback(() => setShow(true), [setShow]);
  // const close = useCallback(() => setShow(false), [setShow]);

  return (
    <StyledRoot display={display} style={style}>
      <TooltipBase title={text} interactive {...props} onClose={onClose}>
        <QuestionWrapper
          size={size}
          // onClick={open}
          // onMouseEnter={open}
          // onMouseLeave={close}
        >
          <IconInfoCircle color={color} size={size} />
        </QuestionWrapper>
      </TooltipBase>
    </StyledRoot>
  );
}

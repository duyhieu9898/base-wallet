import styled from 'styled-components';
import { BoxSpacingProps } from '../../theme/styled';

const Column = styled.div<{
  align?: string;
  justify?: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
`;

export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`;

export const AutoColumn = styled.div<
  {
    gap?: 'sm' | 'md' | 'lg' | string;
    justify?:
      | 'stretch'
      | 'center'
      | 'start'
      | 'end'
      | 'flex-start'
      | 'flex-end'
      | 'space-between';
  } & BoxSpacingProps
>`
  ${({ theme }) => theme.boxSpacing}
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === 'sm' && '8px') ||
    (gap === 'md' && '12px') ||
    (gap === 'lg' && '16px') ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`;

export default Column;

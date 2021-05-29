import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { transparentize } from 'polished';
import { themeProperties } from '../theme';

const TapHeader = styled.div<{ isTwoColumn: boolean }>`
  @media screen and (min-width: 767px) {
    display: flex;
    justify-content: ${({ isTwoColumn }) =>
      isTwoColumn ? 'space-between' : 'flex-end'};
    align-items: center;
  }

  > div {
    flex-basis: ${({ isTwoColumn }) => (isTwoColumn ? '50%' : 'auto')};
    margin-bottom: 20px;

    @media screen and (min-width: 767px) {
      margin-bottom: 0;
    }
  }
`;

const Tabs = styled.div`
  width: 100%;
  @media screen and (min-width: 767px) {
    display: flex;
  }
`;

const Tab = styled.div<{ isActive: boolean; width?: string }>`
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.tabBG};
  cursor: pointer;
  text-align: center;
  flex-basis: ${({ width }) => (width ? width : 'auto')};

  background: ${({ isActive, theme }) =>
    isActive ? theme.tabBG : 'transparent'};
  color: ${({ theme }) => theme.tabColor};
  transition: all 0.2s;
  line-height: 1;

  &:not(:last-child) {
    border-right: none;
  }
  &:hover {
    background: ${({ theme }) => transparentize(0.5, theme.tabBG)};
  }
  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  &:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  @media screen and (min-width: 767px) {
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      border-top-right-radius: 0;
    }
    &:last-child {
      border-bottom-left-radius: 0;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
`;

const WrapBody = styled.div`
  margin-top: ${themeProperties.paddingCard};
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <WrapBody
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </WrapBody>
  );
}

interface CommonTabProps {
  defaultValue?: number;
  tabList: any[];
  width?: string;
  header?: React.ReactNode;
  rightComp?: React.ReactNode;
  onclickCb?: (index) => void;
}

const CommonTab = ({
  defaultValue,
  tabList = [],
  width = undefined,
  header,
  rightComp = null,
  onclickCb,
}: CommonTabProps) => {
  const [tabIndex, setTabIndex] = React.useState(defaultValue ?? 0);
  const history = useHistory();

  const isTwoColumn = !!rightComp;

  useEffect(() => {
    if (history?.location?.hash) {
      const hasValueTab = history.location.hash.split('#')[1];
      const tabItem = tabList.find(item => item.hash === hasValueTab);
      if (tabItem && tabIndex !== tabItem.index) {
        setTabIndex(tabItem.index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location, history.location.hash]);
  const handleChange = (event, newValue) => {
    if (history?.location?.hash) {
      history.replace({ hash: '' });
      setTimeout(() => {
        setTabIndex(newValue);
      }, 0);
    } else {
      setTabIndex(newValue);
    }
  };

  return (
    <div>
      <TapHeader isTwoColumn={isTwoColumn}>
        <Tabs>
          {tabList.length > 1 &&
            tabList.map(item => (
              <Tab
                key={item.index}
                isActive={tabIndex === item.index}
                onClick={e => {
                  handleChange(e, item.index);
                  onclickCb && onclickCb(item.index);
                }}
                width={width}
              >
                {item.title}
              </Tab>
            ))}
        </Tabs>
        {rightComp}
      </TapHeader>

      {header ?? null}

      {tabList.map(item => (
        <TabPanel key={item.index} value={tabIndex} index={item.index}>
          {item.content}
        </TabPanel>
      ))}
    </div>
  );
};

export default CommonTab;

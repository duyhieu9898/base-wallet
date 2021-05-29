import React, { useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Tabs, Tab, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';

const StyledHome = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  color: #fff;
  @media screen and (min-width: 768px) {
    padding: 0 0;
  }
`;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`council-tabpanel-${index}`}
      aria-labelledby={`council-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const CommonTabs = styled(props => (
  <Tabs classes={{ indicator: 'indicator' }} {...props} />
))`
  border-bottom: 1px solid #3a3f50;
  & .indicator {
    background-color: rgba(0, 0, 0, 0);
  }
`;

const CommonTab = styled(({ index, ...props }) => (
  <Tab
    classes={{ selected: 'selected' }}
    id={`councilTab-tab-${index}`}
    aria-controls={`councilTab-tabpanel-${index}`}
    {...props}
  />
))`
  && {
    font-size: 1em;
    font-weight: 700;
    text-transform: none;
    min-width: unset;
  }
`;

const StyledContainerTab = styled.div`
  display: flex;
`;

const StyledSidebar = styled.div`
  width: 270px;
  border-right: 1px solid #3a3f50;
  padding: 20px;
`;
const StyledContentTab = styled.div`
  flex: 1;
  padding: 24px 32px;
  overflow-y: scroll;
  height: calc(100vh - 100px);
`;

const StyledItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const StyledItem = styled.div`
  width: 220px;
  margin: 8px;
  border: 1px solid #3a3f50;
  border-radius: 4px;
  background-color: #282b39;
  &:hover {
    box-shadow: 0px 0 8px rgba(255, 255, 255, 0.4);
    border: 1px solid #70727b;
  }
`;
const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;
const StyledNumber = styled.div`
  background-color: #3a3f50;
  padding: 2px 8px 0px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  color: #a1a6b6;
  font-size: 12px;
  line-height: 16px;
`;
const StyledPrice = styled.div`
  margin-right: 12px;
  font-size: 20px
  font-weight: 500;
`;
const StyledContent = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-height: 170px;
    margin: 12px;
  }
`;

const StyledBottom = styled.div`
  border-top: 1px solid #3a3f50;
  padding: 12px;
`;

const StyledName = styled.div`
  font-size: 14px;
`;

const StyledTags = styled.div`
  margin-top: 8px;
  display: flex;
`;

const StyledTag = styled.div<{color: string}>`
  background-color: ${({color})=> color};
  font-size: 12px;
  padding: 1px 10px;
  border-radius: 4px;
  line-height: 18px;
`;
const StyledFormControl = styled(FormControl)`
  width: 160px;
  .MuiOutlinedInput-input {
    padding: 12px 14px;
  }
`;

const StyledHeaderFilter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`

const  StyledTabItem = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  img {
    margin-right: 5px;
    width: 24px;
  }
`
const StyledTabFilter = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content space-between;
`

const StyledLabel = styled.div`
  font-size: 20px
`
const StyledClear = styled.div`
  font-size: 14px;
  color: #046cfc;
`
const StyledTagsFilter = styled.div`

`
const StyledLabelTag = styled.div`
  font-size: 11px;
  color: #6b7185;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
`

const StyledFilterTags = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
`
const StyledFilterTag = styled.div`
  width: 50%;
  margin-bottom: 12px;
`

export const Home = observer(() => {
  const [valueTab, setValueTab] = useState(0);
  const [sale, setSale] = React.useState(0);
  const handleChange = event => {
    setSale(event.target.value);
  };

  function handleChangeTab(e, value) {
    setValueTab(value);
  }
  function a11yProps(index) {
    return {
      id: `common-tab-${index}`,
      'aria-controls': `council-tabpanel-${index}`,
    };
  }
  const data = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  return (
    <StyledHome>
      <CommonTabs
        value={valueTab}
        onChange={handleChangeTab}
        aria-label="tabs"
        classes={{ indicator: 'indicator' }}
      >
        <CommonTab label={<StyledTabItem><img src={require('../../assets/images/tab-land.png')} alt="" />lands</StyledTabItem>} {...a11yProps(0)} />
        <CommonTab label={<StyledTabItem><img src={require('../../assets/images/tab-item.png')} alt="" />items</StyledTabItem>} {...a11yProps(1)} />
      </CommonTabs>
      <TabPanel value={valueTab} index={0}>
        <StyledContainerTab>
          <StyledSidebar>
            <StyledTabFilter>
              <StyledLabel>Filter</StyledLabel>
              <StyledClear>Clear filter</StyledClear>
            </StyledTabFilter>
            <StyledTagsFilter>
              <StyledLabelTag>Enviroment</StyledLabelTag>
              <StyledFilterTags>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#6cc000">Forest</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#6fccd4">Mystic</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#3e7292">Genesis</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#f99e2e">Savannah</StyledTag>}
                  />
                </StyledFilterTag>
              </StyledFilterTags>
            </StyledTagsFilter>
          </StyledSidebar>
          <StyledContentTab>
            <StyledHeaderFilter>
              <StyledFormControl variant="outlined">
                <Select value={sale} onChange={handleChange}>
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={1}>For sale</MenuItem>
                </Select>
              </StyledFormControl>
              <StyledFormControl variant="outlined">
                <Select value={sale} onChange={handleChange}>
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={1}>For sale</MenuItem>
                </Select>
              </StyledFormControl>
            </StyledHeaderFilter>
            <StyledItems>
              {data.map((item, index) => (
                <StyledItem key={index}>
                  <StyledHeader>
                    <StyledNumber>#454</StyledNumber>
                    <StyledPrice>0.0048</StyledPrice>
                  </StyledHeader>
                  <StyledContent>
                    <img
                      src="https://cdn.axieinfinity.com/terrarium-items/s8a.png"
                      alt=""
                    />
                  </StyledContent>
                  <StyledBottom>
                    <StyledName>Warbler Nest</StyledName>
                    <StyledTags>
                      <StyledTag color="#6cc000">Forest</StyledTag>
                    </StyledTags>
                  </StyledBottom>
                </StyledItem>
              ))}
            </StyledItems>
          </StyledContentTab>
        </StyledContainerTab>
      </TabPanel>
      <TabPanel value={valueTab} index={1}>
      <StyledContainerTab>
          <StyledSidebar>
            <StyledTabFilter>
              <StyledLabel>Filter</StyledLabel>
              <StyledClear>Clear filter</StyledClear>
            </StyledTabFilter>
            <StyledTagsFilter>
              <StyledLabelTag>Enviroment</StyledLabelTag>
              <StyledFilterTags>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#6cc000">Forest</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#6fccd4">Mystic</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#3e7292">Genesis</StyledTag>}
                  />
                </StyledFilterTag>
                <StyledFilterTag>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={true}
                        onChange={() => {}}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={<StyledTag color="#f99e2e">Savannah</StyledTag>}
                  />
                </StyledFilterTag>
              </StyledFilterTags>
            </StyledTagsFilter>
          </StyledSidebar>
          <StyledContentTab>

          </StyledContentTab>
        </StyledContainerTab>
      </TabPanel>
    </StyledHome>
  );
});

export default Home;

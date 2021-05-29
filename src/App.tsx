import React from 'react';
import { HashRouter,Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core';
import Web3ReactManager from './components/Web3ReactManager';
// import Header from './components/Header';
import ThemeProvider, { GlobalStyle } from './theme/index';
import './App.css';
import Home from './pages/Home'
import NetworkUpdater from './state/network/updater';
import useMuiThemeOverrides from './theme/override';
import AppLayout from './components/layout/AppLayout'


const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

const Marginer = styled.div`

`;

const AppSell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function Updaters() {
  return (<NetworkUpdater />);
}

const App = () => {
  const renderViews = () => {
    return (
      <AppSell>
        <Switch>
          <Route path="/marketplace" component={Home} />
          <Redirect from="/" to="/marketplace" />
        </Switch>
        <Marginer />
      </AppSell>
    );
  };

  return (
    <MuiThemeProvider theme={useMuiThemeOverrides()}>
      <ThemeProvider>
        <React.Fragment>
          <Web3ReactManager>
            <Updaters />
            <HashRouter>
              <AppWrapper>
                <AppLayout>
                  {renderViews()}
                  {/* <Footer /> */}
                </AppLayout>
              </AppWrapper>
            </HashRouter>
          </Web3ReactManager>
          <GlobalStyle />
        </React.Fragment>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;

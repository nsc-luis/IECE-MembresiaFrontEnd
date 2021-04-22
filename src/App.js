import React from 'react';
import './assets/css/App.css';
import Router from './Router';
import GlobalStyle from './styles/GlobalStyle';

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <Router />
  </React.Fragment>
)

export default App;

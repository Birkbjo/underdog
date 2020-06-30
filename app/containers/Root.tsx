import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Store } from '../store';
import Routes from '../Routes';

type Props = {
  store: Store;
  history: History;
};

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </ThemeProvider>
  </Provider>
);

export default hot(Root);

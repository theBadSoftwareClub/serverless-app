import React, { useState } from 'react';
import { Container }  from '@material-ui/core';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import './App.css';
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './components/navigation';
import Home from './pages/home';
import Items from './pages/items';
Amplify.configure(aws_exports);

const displayfont = "'Londrina Shadow', 'sans-serif'";
const smalldisplayfont = "'Londrina Solid', 'sans-serif'";
const opensans = "'Open Sans', 'sans-serif'";
const monospace = "'PT Mono', 'sans-serif'";

// This is the highest tier of theme, styling here will cascade down through nested components, but more specific theme elements will be added downstream as well
const app_theme = createTheme({
  spacing: 2,
  typography: {
    primary: {
      fontFamily: opensans,
    },
    h6: {
      fontFamily: displayfont,
      fontSize: '4rem',
      fontWeight: 900,
      flexGrow: 1,
    },
    h5: {
      fontFamily: smalldisplayfont,
      fontSize: '2rem',
      fontWeight: 500,
      flexGrow: 1,
      paddingLeft:'20px',
    },
    h4: {
      fontFamily: opensans,
      padding: '10px',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: monospace,
      padding: '10px',
      fontSize: '1rem',
      fontWeight: 'bold',
    },
  },
  palette: {
    primary: {
      light: '#be9c91',
      main: '#8d6e63',
      dark: '#5f4339',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffff74',
      main: '#ffd740',
      dark: '#c8a600',
      contrastText: '#000',
    },
    background: {
      default: '#eceff1',
    },

  }
});

// usestyles makes styles out of the theme
const useStyles = makeStyles((app_theme) => ({
  pagetitle: {
    padding: app_theme.spacing(9),
  },
  canvas: {
    padding: 20,
  },
  input: {
    display: 'none',
  },
}));


const App = () => {
  const [drawer, setDrawer] = useState();
  const classes = useStyles();
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawer({ ...drawer, [anchor]: open });
  };

  return (
    <ThemeProvider theme={ app_theme }>
      <BrowserRouter>
        <Navigation />
        <Container>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/items" component={Items} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

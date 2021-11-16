import React, {useEffect, useState} from 'react';
import {Container, Modal} from '@material-ui/core';
import aws_exports from './aws-exports';
import './App.css';
import {
    createTheme,
    ThemeProvider,
} from '@material-ui/core/styles';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Navigation from './components/navigation';
import Home from './pages/home';
import Items from './pages/items';
import {Amplify} from 'aws-amplify';
import {AmplifyAuthenticator, AmplifySignUp, AmplifySignIn} from '@aws-amplify/ui-react';
import { onAuthUIStateChange} from '@aws-amplify/ui-components';

Amplify.configure(aws_exports);

const displayfont = "'Londrina Shadow', 'sans-serif'";
const smalldisplayfont = "'Londrina Solid', 'sans-serif'";
const opensans = "'Open Sans', 'sans-serif'";
const monospace = "'PT Mono', 'sans-serif'";

// Theme
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
            paddingLeft: '20px',
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

const App = () => {

    // Hooks
    const [user, setUser] = useState();
    const [authState, setAuthState] = useState();
    const [authopen, setAuthopen] = useState(false);

    // Functions for requests to servers
    async function testServer() {

        if ((user !== undefined) && (user !== null)) {

            let url = encodeURI(`https://${process.env.REACT_APP_API_DOMAIN}.${process.env.REACT_APP_ROOT_DOMAIN}/`)
            let token = user.signInUserSession.idToken.jwtToken

            const response = await fetch(url, {
                redirect: 'follow',
                headers: {
                    Authorization: `${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            // handle the followup with another await
            // eslint-disable-next-line no-unused-vars
            const res = await response.json()
                .then((json) => {
                    console.log('json', json)
                })
                .catch((err) => console.log(err));
        }
    }

    // Functions for client-side interactions
    const handleClose = () => {
        setAuthopen(false)
    };

    // Use Effect
    useEffect(() => {

        return onAuthUIStateChange((nextAuthState, authData) => {
            console.log('state app:', nextAuthState)
            setAuthState(nextAuthState);
            if (nextAuthState === 'signedin') {
                setUser(authData);
                setAuthopen(false);
                testServer();
            }
            if (nextAuthState === 'signedout') {
                setUser(null);
                setAuthopen(false);
            }

        });
    });

    // Component
    return (
        <ThemeProvider theme={app_theme}>
            <BrowserRouter>
                {authopen ? (
                    <Modal
                        open={authopen}
                        onClose={handleClose}
                    >
                        {<AmplifyAuthenticator>
                            <AmplifySignIn
                                headerText="Please Sign In"
                                slot="sign-in"
                                usernameAlias="email"
                            >
                                <div slot="federated-buttons">
                                </div>
                            </AmplifySignIn>
                            <AmplifySignUp
                                slot="sign-up"
                                usernameAlias="email"
                                formFields={[
                                    {
                                        type: "email",
                                        label: "Email:",
                                        placeholder: "Custom email placeholder",
                                        inputProps: {required: true, autocomplete: "username"},
                                    },
                                    {
                                        type: "password",
                                        label: "Password:",
                                        placeholder: "Custom password placeholder",
                                        inputProps: {required: true, autocomplete: "new-password"},
                                    },

                                ]}
                            />
                        </AmplifyAuthenticator>}
                    </Modal>
                ) : null
                }

                <Navigation setAuthopen={setAuthopen} authState={authState}
                            setAuthState={setAuthState} user={user} setUser={setUser}/>

                <Container>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/items" render={props => <Items user={user}/>}/>
                    </Switch>
                </Container>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;

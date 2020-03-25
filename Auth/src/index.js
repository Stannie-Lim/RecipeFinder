import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link, Redirect } from 'react-router-dom';

// components
import Nav from './components/Nav';
import IngredientsForm from './components/IngredientsForm';
import Login from './components/Login';

// logged in components 
import User_ from './components/authorized/User_';
import Nav_ from './components/authorized/Nav_';
import FavoriteRecipes_ from './components/authorized/FavoriteRecipes_';

class App extends Component { 
    constructor() {
        super();
        this.state = {
            authenticated: false,
            email: '',
            err: ''
        };
    }

    render() {
        const { email, authenticated, err } = this.state;

        const findRecipes = (ev, ingredients) => {
            ev.preventDefault();
            ingredients.forEach((ingr, index) => console.log(`ingr ${index + 1}: ${ingr}`));
        };

        const getCredentials = info => {
            const { email, password } = info;
            console.log(email, password);

            // IF LOGIN IS SUCCESSFUL, SET STATE WITH AUTHENTICATED BEING TRUE AND PUT IN THE USER INFO LIKE ID
            //IF LOGIN FAILED (WRONG PASSWORD, WRONG EMAIL), SET STATE WITH AUTH = FALSE AND ERR = 'WRONG INFO'
            this.setState({ email: email, authenticated: true });
            // this.setState({ err: 'Incorrect email or password' });
        };

        const logout = () => {
            this.setState({ email: '', authenticated: false, err: 'Successfully logged out' });
            // setTimeout( () => window.addEventListener("hashchange", () => this.setState({ err: '' })), 100 );
        };

        return (
            <HashRouter>
                { /* root paths */ }
                <Link to='/' className='homepage' >RECIPE FINDER</Link>
                <Route path='/' render={ props =>  authenticated ? <Nav_ {...props} logout={ logout } /> : <Nav {...props} /> } />
                <Route exact path='/' render={ () => <IngredientsForm findRecipes={ findRecipes } /> } />

                { /* login/register */ }
                <Route exact path='/login' render={ () =>   <main> 
                                                                <h1 className={`error ${ err ? '' : 'invisibleerror'} `}>{err}</h1>
                                                                <Login login={ getCredentials }/>
                                                            </main> } />

                { /* not authorized */ }
                <Route exact path='/user' render={ () => authenticated ? '' : <h1>Not logged in</h1>} />

                { /* successful authorization */ }
                <Route render={ () => ( authenticated ? (<main>
                                                            <Redirect to='/user' />
                                                            <Route exact path='/user' 
                                                             render={ () => <User_ info={ email } /> } />  
                                                        </main>) 
                                                        : <Redirect to='/login' /> )} />
                <Route render={ () => ( authenticated ? (<main> 
                                                            <Redirect to='/favorite' />
                                                            <Route exact path='/favorite'
                                                             render={ () => <FavoriteRecipes_ userid={ /* GET USER ID FROM AUTHENTICATION THING */ email } /> } />
                                                         </main>)
                                                      : <Redirect to='/login' /> )} />

            </HashRouter>
        );
    }
};

ReactDOM.render(<App />, document.querySelector('#root'));
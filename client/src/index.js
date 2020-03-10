import React from 'react';
import ReactDOM from 'react-dom';
import 'gestalt/dist/gestalt.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Navbar from './components/Navbar'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Checkout from './components/Checkout'
import Brews from './components/Brews'

import { getToken } from './Utils'

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        getToken() !== null ? <Component {...props} /> : <Redirect to={{
            pathname: '/signin',
            state: { from: props.location }
        }} />
        )
    } />
)

const Root = () => (
        <Router>
            <React.Fragment>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/signin" component={Signin} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute path="/checkout" component={Checkout} />
                    <Route path="/:brandId" component={Brews} />
                </Switch>
            </React.Fragment>
        </Router>

)


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();

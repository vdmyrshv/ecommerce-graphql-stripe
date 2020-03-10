import React, { Component } from 'react'

import { NavLink, withRouter } from 'react-router-dom'

import { getToken, clearToken, clearCart } from '../Utils'


import { 
    Box, 
    Text, 
    Heading, 
    Image, 
    Button 
} from 'gestalt';

class Navbar extends Component {

    handleSignout = () => {
        clearToken();
        clearCart();
        this.props.history.push('/');
    }
    
    
    render(){
        
        return getToken() !== null ? <AuthNav handleSignout={this.handleSignout} /> : <UnAuthNav />
    
    }
}

const AuthNav = ({handleSignout}) => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="around"
        height={70}
        color="midnight"
        padding={1}
        shape="roundedBottom">
        {/* Checkout link */}
        <NavLink to="/checkout"><Text size="xl" color="white">Checkout</Text></NavLink>

        {/* Title and Logo */}

        <NavLink exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={50} width={50}>
                    <Image
                        alt="BrewHaha Logo"
                        naturalHeight={1}
                        naturalWidth={1}
                        src="./icons/logo.svg"
                    />
                </Box>
                <Heading size="xs" color="orange">       
                    BrewHaha
                </Heading>
            </Box>
        </NavLink>

        {/* Signout Button */}
        <Button
            color="transparent"
            text="Sign out"
            inline
            size="md"
            onClick={handleSignout}
        />
    </Box>
)

const UnAuthNav = () => (
    <Box
        display="flex"
        alignItems="center"
        justifyContent="around"
        height={70}
        color="midnight"
        padding={1}
        shape="roundedBottom">
    {/* Sign in Link */}
    <NavLink to="/signin"><Text size="xl" color="white">Signin</Text></NavLink>

    {/* Title and Logo */}

    <NavLink exact to="/">
        <Box display="flex" alignItems="center">
            <Box margin={2} height={50} width={50}>
                <Image
                    alt="BrewHaha Logo"
                    naturalHeight={1}
                    naturalWidth={1}
                    src="./icons/logo.svg"
                />
            </Box>
            <Heading size="xs" color="orange">       
                BrewHaha
            </Heading>
        </Box>
    </NavLink>

    <NavLink to="/signup"><Text size="xl" color="white">Signup</Text></NavLink>
    </Box>
)


export default withRouter(Navbar);
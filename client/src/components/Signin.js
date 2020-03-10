import React, { Component } from 'react'
import { Container, Box, Heading, Text, TextField, Button } from 'gestalt'

import { setToken } from '../Utils'

import Strapi from 'strapi-sdk-javascript/build/main'

import ToastMessage from './ToastMessage'

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signin extends Component {
    state = {
        username: "",
        password: "",
        toast: false,
        toastMessage: "",
        loading: false
    }

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value })
    }

    handleSubmit = async event => {

        const { username, password } = this.state;

        event.preventDefault();
        if (this.isFormEmpty(this.state)){
            this.showToast('Fill in All Fields');
            return;
        }
        //Sign in user
        try {
            this.setState({loading: true});
            //const response = await strapi.register(username, email, password)
            await strapi.login(username, password).then(res => {
                setToken(res.jwt)
                console.log(res)
            })
            this.setState({loading: false});
            this.redirectUser('/')

        } catch(err) {
            this.setState({loading: false});
            this.showToast(err.message)
            console.error(err.message)
        }
    }

    redirectUser = path => this.props.history.push(path);

    isFormEmpty = ({ username, password }) => {

        return !username || !password;
    }

    showToast = toastMessage => {
        this.setState({toast: true, toastMessage});
        setTimeout(()=> {this.setState({ toast: false, toastMessage: '' })}, 5000)
    }

    render(){

        const { toast, toastMessage, loading } = this.state;

        return(
            <Container>
                <Box
                    dangerouslySetInlineStyle={{
                        __style:{
                            backgroundColor: '#d6a3b1'
                        }
                    }}
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"

                >
                    <form
                        style={{
                            display: 'inlineBlock',
                            textAlign: 'center',
                            maxWidth: 450
                        }}
                        onSubmit={this.handleSubmit}
                    >
                    {/* Sign in form for heading */}
                        <Box
                            marginBotton={2}
                            display="flex"
                            direction="column"
                            alignItems="center"
                        >
                            <Heading color="midnight">
                                Let's Get Started
                            </Heading>
                            <Text italic color="orchid">Sign up to order some brews!</Text>
                            {/* username input */}
                            <TextField 
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={this.handleChange}
                            />
                            <TextField 
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={this.handleChange}
                            />
                            <Button
                                color="blue"
                                text="Submit"
                                type="submit"
                                disabled={loading}
                            >

                            </Button>
                        </Box>
                    </form>
                </Box>
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        )
    }
}

export default Signin;
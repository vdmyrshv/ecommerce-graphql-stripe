import React, { Component } from 'react'
import { Container, Box, Heading, Text, TextField, Button, Modal, Spinner, Card } from 'gestalt'

import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements'

import { getCart, calculatePrice, clearCart, calculateAmount } from '../Utils'

import { withRouter } from 'react-router-dom'


import Strapi from 'strapi-sdk-javascript/build/main'


import ToastMessage from './ToastMessage'

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {

    state = {
        cartItems: [],
        address: '',
        postalCode: '',
        city: '',
        confirmationEmailAddress: '',
        toast: false,
        toastMessage: '',
        orderProcessing: false,
        modal: false
    }

    componentDidMount(){
        this.setState({ cartItems: getCart() })
    }
    
    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({ [event.target.name]: value })
    }

    handleSubmitOrder = async () => {
        
        const { cartItems, city, address, postalCode } = this.state;
        console.log(this.state)

        const amount = calculateAmount(cartItems);
        console.log(amount)
        //process order
        this.setState({ orderProcessing: true})
        let token;
        try {
            const response = await this.props.stripe.createToken();
            console.log(response)
            token = response.token.id;
            console.log(token)
            strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                city,
                postalCode,
                address,
                token,
            }).then(() =>{
                console.log("success");
                this.setState({orderProcessing: false, modal: false});
                clearCart();
                this.showToast('Your order has been successfully submitted', true);
            })
            //create stripe token
            //create order with strapi sdk(make request to backend)
            //set orderprocessing to false, set modal to false
            //clear user cart of brews
            //show success toast
        } catch(err) {
            this.setState({orderProcessing: false, modal: false})
            this.showToast(err.message)
            console.log("error", err)
            //set order processing to false, modal to false
            //show error toast
        }
    }

    closeModal = () =>{
        this.setState({modal: false});
    }

    handleConfirmOrder = async event => {

        event.preventDefault();
        if (this.isFormEmpty(this.state)){
            this.showToast('Fill in All Fields');
            return;
        }
    
        this.setState({modal: true});
        
    }

    //redirectUser = path => this.props.history.push(path);

    isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {

        return !address || !postalCode || !city || !confirmationEmailAddress;
    }

    showToast = (toastMessage, redirect = false) => {
        this.setState({toast: true, toastMessage});
        setTimeout(()=> this.setState({ toast: false, toastMessage: '' }, 
            //if true passed to 'redirect' argument, redirect home
            ()=> redirect && this.props.history.push('/')), 5000)
    }

    render(){

        const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;

        return(
            <Container>
                <Box
                    color="darkWash"
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"

                >
                    {/* Checkout form for heading */}
                    <Heading color="midnight" size="xs">Checkout</Heading>
                    {cartItems.length > 0 ? <React.Fragment>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            marginTop={2}
                            marginBottom={6}
                        >
                            <Text color="darkGray" italic>{cartItems.length} items for Checkout </Text>
                            <Box padding={2}>
                                {cartItems.map(item=>(
                                    <Box key={item._id} padding={1}>
                                        <Text color="midnight">
                                            {item.name} x {item.quantity} = ${(item.quantity*item.price).toFixed(2)}
                                        </Text>
                                    </Box>
                                ))}
                            </Box>
                            <Text bold>Total Amount: ${calculatePrice(cartItems)}</Text>
                        </Box>
                        {/* Checkout form */}
                        <form
                            style={{
                                display: 'inlineBlock',
                                textAlign: 'center',
                                maxWidth: 450
                            }}
                            onSubmit={this.handleConfirmOrder}
                        >

                            <Box
                                marginBotton={2}
                                alignItems="center"
                            >
                                {/* username input */}
                                <TextField 
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Shipping Address"
                                    onChange={this.handleChange}
                                />
                                {/* Postal Code Input */}
                                <TextField 
                                    id="postalCode"
                                    type="text"
                                    name="postalCode"
                                    placeholder="PostalCode"
                                    onChange={this.handleChange}
                                />
                                {/* City input */}
                                <TextField 
                                    id="city"
                                    type="text"
                                    name="city"
                                    placeholder="City of Residence"
                                    onChange={this.handleChange}
                                />
                                <TextField 
                                    id="confirmationEmailAddress"
                                    type="text"
                                    name="confirmationEmailAddress"
                                    placeholder="Confirmation Email Address"
                                    onChange={this.handleChange}
                                />
                                {/* Credit Card Element */}

                                <CardElement id="stripe__input" onReady={input => input.focus()} />

                                <Button id="stripe__button" type="submit" color="red" text="Submit" />
                            </Box>
                        </form>
                    </React.Fragment> : (
                        <Box color="darkWash" shape="rounded" padding={4}>
                            <Heading align="center" color="watermelon" size="xs">Your cart is empty</Heading>
                            <Text align="center" italic color="green">Add some brews!</Text>
                        </Box>
                    )}
                </Box>
                {/* Confirmation Modal */}
                {modal && (
                    <ConfirmationModal 
                        orderProcessing={orderProcessing} 
                        cartItems={cartItems}
                        closeModal={this.closeModal}
                        handleSubmitOrder={this.handleSubmitOrder}

                    />
                )}
                <ToastMessage show={toast} message={toastMessage} />
            </Container>
        )
    }
}

const ConfirmationModal = ({orderProcessing, cartItems, closeModal, handleSubmitOrder}) => (
    <Modal
        accessibilityCloseLabel="close"
        accessibilityModalLabel="Confirm your order"
        heading="Confirm your order"
        onDismiss={closeModal}
        footer={
            <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
                <Box padding={1}>
                    <Button
                        size="lg"
                        color="red"
                        text="Submit"
                        disabled={orderProcessing}
                        onClick={handleSubmitOrder} 
                    />
                </Box>
                <Box padding={1}>
                    <Button
                        size="lg"
                        text="Cancel"
                        disabled={orderProcessing}
                        onClick={closeModal}
                    />
                </Box>
            </Box>
        }
        role="alertdialog"
        size="sm"
    >
        {/* Order Summary */}
        {!orderProcessing && (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                direction="column"
                padding={2}
                color="lightWash"
            >
                {cartItems.map(item=>(
                    <Box key={item._id} padding={1}>
                        <Text size="lg" color="red">
                            {item.name} x {item.quantity} = ${(item.quantity*item.price).toFixed(2)}
                        </Text>
                    </Box>
                ))}
                <Box paddingY={2}>
                    <Text size="lg" bold>
                        Total: ${calculatePrice(cartItems)}
                    </Text>
                </Box>
            </Box>
            )
        }
        {/* Order processing spinner */}
        <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner"/>
        {orderProcessing && <Text align="center" italic >Submitting Order...</Text>}
    </Modal>
)

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
    <StripeProvider apiKey="pk_test_plk8pDklHmEKKJrBWG7ZFSHk00fO6JDdxh">
        <Elements>
            <CheckoutForm />
        </Elements>

    </StripeProvider>
)

export default Checkout;
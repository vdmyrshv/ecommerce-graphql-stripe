import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'

import { Box, Heading, Text, Image, Card, Button, Mask, IconButton} from 'gestalt'

import Strapi from 'strapi-sdk-javascript/build/main'

import { calculatePrice, getCart, setCart } from '../Utils'

import Loader from './Loader';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Brews extends Component{

    state = {
        brews:[],
        brand:"",
        loadingBrands: true,
        cartItems: []
    }

    
    async componentDidMount(){
        
        const { brandId } = this.props.match.params;
        
        try{
            strapi.request('POST', '/graphql', {
                data: {
                    query: `
                    query{
                        brand(id: "${brandId}"){
                            _id
                            name
                            brews{
                                _id
                                name
                                description
                                image {
                                    url
                                } 
                                price
                            }
                        }
                    }
                    `
                }
            }).then(({data}) => {
                console.log(data)
                this.setState({
                    brews: data.brand.brews, 
                    brand: data.brand.name, 
                    loadingBrands: false,
                    cartItems: getCart()
                })})
                } catch(err) {
                    console.error(err);
                    this.setState({loadingBrands: false})
                }
            }
            
    addToCart = brew =>{
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id);
        if(alreadyInCart === -1 ){
            const updatedItems = this.state.cartItems.concat({
                ...brew, 
                quantity: 1
            });
        this.setState({cartItems: updatedItems}, ()=> setCart(updatedItems));
        } else {
            const updatedItems = [...this.state.cartItems]
            updatedItems[alreadyInCart].quantity += 1;
            this.setState({cartItems: updatedItems}, ()=> setCart(updatedItems));
        }
    }

    deleteItemFromCart = itemToDeleteId => {
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId);
        this.setState({cartItems: filteredItems}, ()=> setCart(filteredItems));
    }
    
    render(){
        const { brand, brews, loadingBrands, cartItems } = this.state;
        return(
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                    __style:{
                        flexWrap: "wrap-reverse"
                    }
                }}
            >
                {/* Brews Section */}
                <Box
                    display="flex"
                    direction="column"
                    alignItems="center"
                >
                    {/* Brews Heading */}
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                    {/* Brews */}
                    <Box
                        dangerouslySetInlineStyle={{
                            __style:{
                                backgroundColor: '#bdcdd9'
                            }
                        }}
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                        wrap
                    >
                        {brews.map(brew=> (
                            <Box paddingY={4} width={210} margin={2} key={brew._id}>
                                <Card
                                    image={
                                    <Box height={250} width={200}>
                                        <Image 
                                        src={`${apiUrl}${brew.image.url}`}
                                        alt="Beer Logo"
                                        fit="cover"
                                        naturalHeight={1}
                                        naturalWidth={1}
                                        />
                                    </Box>
                                    }>
                                    <Box 
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        direction="column"
                                    >
                                        <Box marginBottom={2}>
                                            <Text bold size="xl" align="center">{brew.name}</Text>
                                        </Box>
                                        <Text>{brew.description}</Text>
                                        <Text color="orchid">${brew.price}</Text>
                                        <Box margnTop={2}>
                                            <Text bold size="xl" align="center">
                                                <Button onClick={()=>this.addToCart(brew)} color="blue" text="Add to Cart"/>
                                            </Text>
                                        </Box> 
                                    </Box>
                                </Card>
                                
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box alignSelf= "end" marginTop={2} marginLeft={8}>
                    <Mask shape="rounded" wash>
                        <Box display="flex" direction="column" alignItems="center" padding={2}>
                            <Heading align="center" size="md">Your Cart</Heading>
                            <Text color="gray" italic>
                                {cartItems.length} items selected
                            </Text> 
                            {/* cart items */}
                            {cartItems.map(item => ( 
                                <Box key={item._id} display="flex" alignItems="center">
                                    <Text>{item.name} x {item.quantity} = ${(item.quantity*item.price).toFixed(2)}</Text>
                                    <IconButton
                                        accessibilityLabel="Delete Item"
                                        icon="cancel"
                                        size="sm"
                                        iconColor="red"
                                        onClick={()=> this.deleteItemFromCart(item._id)}
                                        />
                                </Box>

                            ))}
                            <Box margin={2}>
                                {cartItems.length === 0 && (
                                    <Text color="red">Please select some items</Text>
                                )}
                                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                            </Box>
                        </Box>
                    </Mask>                  
                </Box>
                </Box>
            )
    }
}

export default withRouter(Brews);
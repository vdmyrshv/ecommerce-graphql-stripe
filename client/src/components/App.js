import React, { Component } from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon, Spinner } from 'gestalt'
import { Link } from 'react-router-dom'
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main'
import Loader from './Loader';

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  }

  async componentDidMount(){
    try{

      strapi.request('POST', '/graphql', {
        data: {
          query: `
            query{
              brands{
                _id
                name
                description
                image {
                  url
                }
            }
          }
          `
        }
      }).then(({data}) => ( this.setState({brands: data.brands, loadingBrands: false})))

    
    } catch(err){
      console.error(err)
      this.setState({loadingBrands: false})
    }
  }

  handleChange = ({value}) => {
    this.setState({searchTerm: value})
  }

  filteredBrands = ({brands, searchTerm}) => {
    return brands.filter(brand=> (
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        || brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  render() {
    const { searchTerm, loadingBrands } = this.state;
    //console.log(brands)
    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Search Brews" />
          <Box margin={2}>
            <Icon icon="filter" size={20} color={searchTerm ? "orange" : "grey"}/>
          </Box>
        </Box>
        
        <Box
          display="flex"
          justifyContent="center"
          marginBotton={2}
        >
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>  
        </Box>
        <Box 
          dangerouslySetInlineStyle={{
            __style:{
              backgroundColor:"#d6c8ec"
            }
          }}
          shape = "rounded"
          wrap display="flex" justifyContent="around">
          {this.filteredBrands(this.state).map(brand => (
            <Box paddingY={4} width={200} margin={2} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image 
                      src={`${apiUrl}${brand.image[0].url}`}
                      alt="Beer Logo"
                      fit="cover"
                      naturalHeight={1}
                      naturalWidth={1}
                    />
                  </Box>}>
                  <Box 
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    >
                    <Text bold size="xl" align="center">{brand.name}</Text>
                    <Text>{brand.description}</Text>
                    <Text bold size="xl" align="center">
                      <Link to={`/${brand._id}`}>See Brews</Link>
                    </Text>
                  </Box>
              </Card>
            </Box>
          ) )}
        </Box>
        {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner"/> */}
        <Loader show={loadingBrands}/>
      </Container>
    );
  }
}

export default App;

import React from 'react'
import { PropagateLoader } from 'react-spinners'
import { Box } from 'gestalt'

const Loader = ({show}) => (
   show && 
        <Box
            position="fixed"
            dangerouslySetInlineStyle={{
                __style:{
                    botton: 300,
                    left: '50%',
                    transform: 'translateX(-50%)'
                }
            }}
        >
            <PropagateLoader color="darkorange" size={25} margin="3px"/>
        </Box>
    
)

export default Loader;
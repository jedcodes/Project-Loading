import axios from 'axios'


const BASE_URL = 'https://665654029f970b3b36c50619.mockapi.io'


export const fetchAllUsers = async () => {
   try {
     const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.data
   } catch(error) {
    console.log('Error:' , error)
   }
}
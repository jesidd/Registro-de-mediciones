import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'https://medividrios.onrender.com/api/',
    timeout: 20000, // 20 seconds timeout
});

export default httpClient;
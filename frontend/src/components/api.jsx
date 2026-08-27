//Connecting the backend with the frontend

import axios from 'axios'

// The backend URL is read from the REACT_APP_API_URL build-time env variable
// (see frontend/.env.example) and falls back to localhost for local development.
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000",
});

export default instance;

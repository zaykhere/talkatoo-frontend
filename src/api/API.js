import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'

// Create an Axios instance
const API = axios.create({
  baseURL: BASE_URL, // Replace with your actual API base URL
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo")
  console.log(userInfo)
  const token = JSON.parse(userInfo);

  console.log(token, "lmao")

  if(token) {
    config.headers.Authorization = `Bearer ${token.token}`;
  }

  return config;
})

// Add a response interceptor
API.interceptors.response.use(
  (response) => {
    // If the response is successful (status code in the range of 2xx), just return the response
    return response;
  },
  (error) => {
    // If the response status is 401 or 403, handle the error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear local storage
      // localStorage.clear();
      
      // Redirect to the login page
      window.location.href = '/login'; // Adjust the URL as necessary
    }

    // Otherwise, return the error to be handled by the calling code
    return Promise.reject(error);
  }
);

export default API;

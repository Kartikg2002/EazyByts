import axios from "axios";

const AxiosHelper = axios.create({
  baseURL: "http://localhost:9906",
});

// Retrieve token from local storage
const token = localStorage.getItem("token");
if (token) {
  // If a token is found, set it as a default Authorization header for all requests
  AxiosHelper.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default AxiosHelper;

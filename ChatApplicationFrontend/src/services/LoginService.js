import axios from "axios";

export async function loginUser(objectData) {
  try {
    const response = await axios.post(
      "http://localhost:9906/login/check",
      objectData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function saveUser(objectData) {
  try {
    const response = await axios.post(
      "http://localhost:9906/login/save",
      objectData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isTokenExpired(token) {
  try {
    const response = await axios.get(
      `http://localhost:9906/login/isTokenExpired/${token}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import AxiosHelper from "../config/AxiosHelper.js";

export async function createRoom(roomId) {
  try {
    const response = await AxiosHelper.post("/room/createRoom", roomId, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function joinRoom(roomId) {
  try {
    const response = await AxiosHelper.get(`/room/joinRoom/${roomId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMessages(roomId, size = 50, page = 0) {
  try {
    const response = await AxiosHelper.get(
      `/room/getMessages/${roomId}?size=${size}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

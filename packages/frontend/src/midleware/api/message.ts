import axios from "axios";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

export const getChat = async (userId: number) => {
  if(userId === 0) return [];
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/message/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

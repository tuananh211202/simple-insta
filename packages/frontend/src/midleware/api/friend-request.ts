import axios from "axios";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";

export const getRelation = async (userId: number) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/friend-request/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}
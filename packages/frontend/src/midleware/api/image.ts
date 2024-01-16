import axios from "axios";
import { BASE_URL } from "./constants";

export const uploadImage = async (formData: any) => {
  const response = await axios.post(`${BASE_URL}/image/upload`, formData);
  return response.data;
}

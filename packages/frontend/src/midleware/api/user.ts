import axios from "axios";
import { BASE_URL } from "./constants";

type FilterOptions = {
  id: string;
  name: string;
}

export const getListUser = async (filter: FilterOptions) => {
  const response = await axios.post(`${BASE_URL}/user/list`, filter);
  return response.data;
}
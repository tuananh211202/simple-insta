import axios from "axios";
import { BASE_URL, PaginationOptions } from "./constants";

export const getListUser = async (filterOptions: { name: string } & PaginationOptions) => {
  const query = `page=${filterOptions.page}&pageSize=${filterOptions.pageSize}&name=${filterOptions.name}`;
  const response = await axios.get(`${BASE_URL}/user/list?${query}`);
  return response.data;
}
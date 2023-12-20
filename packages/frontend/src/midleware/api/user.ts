import axios from "axios";
import { BASE_URL, PaginationOptions } from "./constants";

export const getListUser = async (name: string, pagOpts: PaginationOptions) => {
  const query = `page=${pagOpts.page}&pageSize=${pagOpts.pageSize}&name=${name}`;
  const response = await axios.get(`${BASE_URL}/user/list?${query}`);
  return response.data;
}
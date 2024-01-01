import axios from "axios";
import { BASE_URL, PaginationOptions } from "./constants";
import Cookies from "js-cookie";

export const getListUser = async (filterOptions: { name: string } & PaginationOptions) => {
  const query = `page=${filterOptions.page}&pageSize=${filterOptions.pageSize}&name=${filterOptions.name}`;
  const response = await axios.get(`${BASE_URL}/user/list?${query}`);
  return response.data;
}

export const getUserById = async (userId: number) => {
  const response = await axios.get(`${BASE_URL}/user/id/${userId}`);
  return response.data;
}

export const updateUser = async (userData: any) => {
  const accessToken = Cookies.get('accessToken');
  return axios.post(`${BASE_URL}/user`, userData, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
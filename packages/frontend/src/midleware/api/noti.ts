import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, PaginationOptions } from "./constants";

export const getUnreadNoti = async () => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/noti`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export const readNoti = async () => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.post(`${BASE_URL}/noti`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export const getAllNoti = async (filterOptions: PaginationOptions) => {
  const query = `page=${filterOptions.page}&pageSize=${filterOptions.pageSize}`;
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/noti/all?${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}



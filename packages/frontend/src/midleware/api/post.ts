import axios from "axios"
import { BASE_URL, PaginationOptions } from "./constants";
import Cookies from "js-cookie";

export const uploadPost = async (data: { imageUrl: string, description: string, mode: string }) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.post(`${BASE_URL}/post/upload`, data,  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
}

export const getPosts = async (pagOpts: PaginationOptions) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/post/posts?page=${pagOpts.page}&pageSize=${pagOpts.pageSize}`,  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
}

export const getList = async (pagOpts: PaginationOptions) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/post/list?page=${pagOpts.page}&pageSize=${pagOpts.pageSize}`,  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
}

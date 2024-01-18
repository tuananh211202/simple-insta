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

export const getList = async (pagOpts: PaginationOptions & { userId: number }) => {
  const accessToken = Cookies.get('accessToken');
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  const isOwner = currentUser.userId !== pagOpts.userId ? 1 : 0;
  const response = await axios.get(`${BASE_URL}/post/list/${pagOpts.userId}?page=${pagOpts.page}&pageSize=${pagOpts.pageSize}&isOwner=${isOwner}`,  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data;
}

export const reactPost = async (postId: number) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.post(`${BASE_URL}/react/${postId}`, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data;
}

export const unReactPost = async (postId: number) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.delete(`${BASE_URL}/react/${postId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data;
}

export const commentPost = async (payload: { postId: number, content: string }) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.post(`${BASE_URL}/comment/${payload.postId}`, { content: payload.content }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data;
}

export const deleteCommentPost = async (commentId: number) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.delete(`${BASE_URL}/comment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data;
}

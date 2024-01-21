import axios from "axios";
import { BASE_URL } from "./constants";
import Cookies from "js-cookie";
import { Relation } from "../../pages/Profile";

export const getRelation = async (userId: number) => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/friend-request/relation/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export const getListFriend = async () => {
  const accessToken = Cookies.get('accessToken');
  const response = await axios.get(`${BASE_URL}/friend-request/list-friend`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export const actionRequest = async (payload: {userId: number, current: Relation}) => {
  const { userId, current } = payload;
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  if(current === Relation.none) {
    createFriendRequest(currentUser.userId, userId);
    return;
  }
  if(current === Relation.friend) {
    deleteFriendRequest(currentUser.userId, userId);
    deleteFriendRequest(userId, currentUser.userId);
    return ;
  }
  if(current === Relation.receiver) {
    createFriendRequest(userId, currentUser.userId);
    return ;
  }
  if(current === Relation.sender) {
    deleteFriendRequest(currentUser.userId, userId);
  }
}

const createFriendRequest = async (senderId: number, receiverId: number) => {
  const response = await axios.post(`${BASE_URL}/friend-request/add/${senderId}/${receiverId}`);
  return response.data; 
}

const deleteFriendRequest = async (senderId: number, receiverId: number) => {
  const response = await axios.post(`${BASE_URL}/friend-request/remove/${senderId}/${receiverId}`);
  return response.data; 
}
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../components/sidebar';
import Page404 from '../pages/404';
import ProfilePage from '../pages/Profile';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { BASE_URL } from '../midleware/api/constants';
import { io } from 'socket.io-client';

// eslint-disable-next-line react-refresh/only-export-components
export const socket = io(BASE_URL);

const AppContainer = styled.div`
  display: flex;
`;

const UserRoutes = () => {
  const currentUser = JSON.parse(Cookies.get('user') ?? '');

  useEffect(() => {
    if(currentUser.userId)
      socket.emit('connectServer', currentUser.userId);
  },[currentUser.userId]);

  useEffect(() => {
    socket.on('connectStatus', (status) => {
      console.log(status.message);
    });

    return () => {
      socket.off('connectStatus');
    };
  }, []);

  return (
    <AppContainer>
      <SideBar />
      <Routes>
        <Route path="*" element={<Page404 />} />
        <Route index path='/home' element={<a>asd</a>} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </AppContainer>
  );
};

export default UserRoutes;
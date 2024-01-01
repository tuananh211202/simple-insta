import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../components/sidebar';
import Page404 from '../pages/404';
import ProfilePage from '../pages/Profile';

const AppContainer = styled.div`
  display: flex;
`;

const UserRoutes = () => {

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
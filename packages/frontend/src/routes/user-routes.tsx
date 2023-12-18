import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../components/sidebar';
import Page404 from '../pages/404';

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
      </Routes>
    </AppContainer>
  );
};

export default UserRoutes;
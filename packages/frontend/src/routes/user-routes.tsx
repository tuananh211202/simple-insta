import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../components/sidebar';

const AppContainer = styled.div`
  display: flex;
`;

const UserRoutes = () => {

  return (
    <AppContainer>
      <SideBar />
      <Routes>
        <Route index element={<a>asd</a>} />
      </Routes>
    </AppContainer>
  );
};

export default UserRoutes;
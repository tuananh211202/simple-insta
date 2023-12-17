import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";

const GuessRoutes = () => {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
    </Routes>
  );
}

export default GuessRoutes;

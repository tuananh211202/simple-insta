import { BrowserRouter, Route } from "react-router-dom";
import GuessRoutes from "./routes/guess-routes";
import UserRoutes from "./routes/user-routes";
import { useAuth } from "./context/auth-context";

const App = () => {
  const { state: authState } = useAuth();
  return (
    <BrowserRouter>
      {authState.isLogin ? <UserRoutes /> : <GuessRoutes />}
    </BrowserRouter>
  );
};

export default App;

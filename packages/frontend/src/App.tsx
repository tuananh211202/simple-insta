import { BrowserRouter } from "react-router-dom";
import GuessRoutes from "./routes/guess-routes";

const App = () => {
  return (
    <BrowserRouter>
        <GuessRoutes />
    </BrowserRouter>
  );
};

export default App;

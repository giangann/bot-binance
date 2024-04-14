import { RouterProvider } from "react-router-dom";
import { appRouters } from "./route/Route";

function App() {
  return (
    <RouterProvider router = {appRouters}/>
  );
}

export default App;

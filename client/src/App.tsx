import { RouterProvider } from "react-router-dom";
import { appRouters } from "./route/Route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <RouterProvider router={appRouters} />
      <ToastContainer />
    </>
  );
}

export default App;

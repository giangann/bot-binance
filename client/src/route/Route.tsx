import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ListOrderChain } from "../pages/account/ListOrderChain";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/chuoi-lenh",
        element: <ListOrderChain />,
      },
    ],
  },
];

export const appRouters = createBrowserRouter(routes);

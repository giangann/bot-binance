import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ListOrderChain } from "../pages/account/ListOrderChain";
import { ChainLog } from "../pages/account/ChainLog";

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
      {
        path: "/log/:chainId",
        element: <ChainLog />,
      },
    ],
  },
];

export const appRouters = createBrowserRouter(routes);

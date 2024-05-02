import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ListOrderChain } from "../pages/account/ListOrderChain";
import { ChainLog } from "../pages/account/ChainLog";
import { Test } from "../pages/test/Test";
import { CoinMixTable } from "../pages/coin/CoinMixTable";

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
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/mix-table",
        element: <CoinMixTable />,
      },
    ],
  },
];

export const appRouters = createBrowserRouter(routes);

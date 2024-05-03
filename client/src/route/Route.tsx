import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ChainLog } from "../pages/account/ChainLog";
import { ListOrderChain } from "../pages/account/ListOrderChain";
import { CoinMixTable } from "../pages/coin/CoinMixTable";
import { Test } from "../pages/test/Test";

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

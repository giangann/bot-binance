import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ChainLog } from "../pages/account/ChainLog";
import { ListOrderChain } from "../pages/account/ListOrderChain";
import { CoinMixTable } from "../pages/coin/CoinMixTable";
import { Test } from "../pages/test/Test";
import { Dataset } from "../pages/dataset/Dataset";

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
        path: "/dataset",
        element: <Dataset />,
      },
      {
        path: "/mix-table",
        element: <CoinMixTable />,
      },
    ],
  },
];

export const appRouters = createBrowserRouter(routes);

import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Home } from "../Home";
import { Layout } from "../Layout";
import { ListOrderChain } from "../pages/account/ListOrderChain";
import { BotTest } from "../pages/bot-test/BotTest";
import { CoinMixTable } from "../pages/coin/CoinMixTable";
import { Dataset } from "../pages/dataset/Dataset";
import { DatasetDetail } from "../pages/dataset/DatasetDetail";

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
        path: "/bot-test",
        element: <BotTest />,
      },
      {
        path: "/dataset",
        element: <Dataset />,
      },
      {
        path: "/dataset/:id",
        element: <DatasetDetail />,
      },
      {
        path: "/mix-table",
        element: <CoinMixTable />,
      },
    ],
  },
];

export const appRouters = createBrowserRouter(routes);

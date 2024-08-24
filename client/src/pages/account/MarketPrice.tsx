import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { UnknownObj } from "../../shared/types/base";

type TPrice = { currPrice: number; maxPrice: number };
export const MarketPrice = () => {
  const [price, setPrice] = useState<TPrice | UnknownObj>({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.on("auto-active-check", (price: TPrice) => {
      console.log('price received:',price)
      setPrice(price);
    });

    return () => {
      socket?.off("auto-active-check");
    };
  }, []);
  
  return (
    <Box p={1}>
      <Typography>
        maxPrice:{" "}
        <Typography sx={{ fontWeight: 600 }} component={"span"}>
          {price.maxPrice}$
        </Typography>
      </Typography>
      <Typography>
        currPrice:{" "}
        <Typography sx={{ fontWeight: 600 }} component={"span"}>
          {price.currPrice}$
        </Typography>
      </Typography>
      <Typography>
        decrease:{" "}
        <Typography sx={{ fontWeight: 600 }} component={"span"}>
          {price.maxPrice - price.currPrice}$
        </Typography>
      </Typography>
    </Box>
  );
};

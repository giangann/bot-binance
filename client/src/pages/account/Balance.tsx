import { Box, Skeleton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
export type TUnknownObj = Record<string, string | number>;
export const Balance = () => {
  const [balance, setBalance] = useState<TUnknownObj>({});
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.on("ws-balance", (newTotal) => {
      console.log(newTotal);
      setBalance({
        ...balance,
        total: newTotal,
      });
    });
    return () => {
      socket?.off("ws-balance");
    };
  }, []);
  return (
    <Box>
      <Typography variant="h6">Your balance</Typography>
      {/* total, coin avaiable */}
      {balance.total ? (
        <Typography>Total: {balance.total} $</Typography>
      ) : (
        <Skeleton
          variant="text"
          sx={{ fontSize: "1rem", width: "100px", height: "30px" }}
        />
      )}
    </Box>
  );
};

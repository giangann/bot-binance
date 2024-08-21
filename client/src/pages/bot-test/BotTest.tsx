import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BotTestContext } from "../../context/BotTestContext";
import { ListOrderChainTest } from "./ListOrderChainTest";
import { getApi } from "../../request/request";

export const BotTest = () => {
  const [botTestActive, setBotTestActive] = useState(false);
  const onToggle = (active: boolean) => {
    setBotTestActive(active);
  };

  useEffect(() => {
    async function checkIsBotTestActive() {
      const response = await getApi<{ isActive: boolean }>("bot/test/status");
      if (response.success) setBotTestActive(response.data.isActive);
      else {
        toast.error(response.error.message);
      }
    }
    checkIsBotTestActive();
  }, []);
  return (
    <Box sx={{ border: `5px solid #365B7D` }}>
      <BotTestContext.Provider value={{ active: botTestActive, onToggle }}>
        <ListOrderChainTest />
      </BotTestContext.Provider>
    </Box>
  );
};

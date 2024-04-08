import { Button, Stack, Typography } from "@mui/material";
import React, { ChangeEventHandler } from "react";
import { BoxFlexEnd } from "../../styled/styled";

interface CustomPagiProps {
  totalPage: number;
  perpage: number;
  currPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPerPageChange: (perPage: number) => void;
  onGoToEnd: () => void;
  onGoToStart: () => void;
}

export const CustomPagi = ({
  totalPage,
  perpage,
  currPage,
  onNextPage,
  onPrevPage,
  onPerPageChange,
  onGoToEnd,
  onGoToStart,
}: CustomPagiProps) => {
  const defaultOptions = [5, 10, 15];

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newPerPage = parseInt(event.target.value);
    onPerPageChange(newPerPage);
  };
  return (
    <BoxFlexEnd>
      <React.Fragment>
        <Stack direction={"row"} alignItems={"center"} sx={{ py: 2 }}>
          <Button disabled={currPage === 1} onClick={onGoToStart}>
            {"|<"}
          </Button>
          <Button disabled={currPage === 1} onClick={onPrevPage}>
            {"<"}
          </Button>
          <Typography fontSize={{ xs: 14, sm: 15 }}>
            Trang: {`${currPage}/${totalPage}`}
          </Typography>
          <Button disabled={currPage === totalPage} onClick={onNextPage}>
            {">"}
          </Button>
          <select defaultValue={perpage} onChange={handleChange}>
            {defaultOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          <Button disabled={currPage === totalPage} onClick={onGoToEnd}>
            {"|>"}
          </Button>
        </Stack>
      </React.Fragment>
    </BoxFlexEnd>
  );
};

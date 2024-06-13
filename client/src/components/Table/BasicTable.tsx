import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeadProps,
  TableRow,
  TableRowProps,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { UnknownObj } from "../../shared/types/base";

interface StrictField<T> {
  header: string;
  fieldKey: keyof T;
  width?: number;
  render?: (row: T) => React.ReactNode | string;
}

interface BasicTableProps<TData extends UnknownObj> {
  fields: StrictField<TData>[];
  data: TData[];
  rowProps?: (row: TData) => TableRowProps;
  headerProps?: TableHeadProps;
}

const DEFAULT_CELL_WIDTH = "20%";

export function BasicTable<TData extends UnknownObj>({
  data,
  fields,
  rowProps,
  headerProps,
}: BasicTableProps<TData>) {
  return (
    <Box>
      <TableContainer>
        <TableHead {...headerProps}>
          {/* map field header */}
          <TableRow>
            {fields.map((field) => (
              <TableCell
                sx={{
                  padding: {
                    xs: "8px 8px 8px 12px",
                    sm: "16px",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                  },
                }}
                width={field.width || DEFAULT_CELL_WIDTH}
              >
                <StyledText sx={{ fontWeight: 700, color: "black" }}>
                  {field.header}
                </StyledText>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {!data.length ? (
          <NoTableData />
        ) : (
          <TableBody>
            {data.map((row: TData) => (
              <TableRow {...rowProps?.(row)}>
                {fields.map(({ fieldKey, render }: StrictField<TData>) => {
                  return (
                    <TableCell sx={{ padding: { xs: "12px", sm: "16px" }, whiteSpace:'nowrap' }}>
                      {render ? (
                        render(row)
                      ) : (
                        <React.Fragment>
                          <DefaultBodyText>
                            {row[fieldKey] ?? "none"}
                          </DefaultBodyText>
                        </React.Fragment>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        )}
      </TableContainer>
    </Box>
  );
}

const StyledText = styled(Typography)(({ theme }) => ({
  textAlign: "left",
  color: "white",
  fontWeight: 500,
  fontSize: 15,
  [theme.breakpoints.up("sm")]: {
    fontSize: 17,
  },
}));

export const DefaultBodyText = styled(Typography)(({ theme }) => ({
  textAlign: "left",
  fontSize: 15,
  [theme.breakpoints.up("sm")]: {
    fontSize: 17,
  },
}));

export const NoTableData = () => {
  return (
    <Box sx={{ my: 8 }}>
      <Typography textAlign={"center"} sx={{ fontSize: 32, fontWeight: 600 }}>
        {"Không có dữ liệu"}
      </Typography>
    </Box>
  );
};

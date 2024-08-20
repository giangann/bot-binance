import { Theme, Typography, styled } from "@mui/material";
import { InputHTMLAttributes, LegacyRef, forwardRef } from "react";
import { MUIStyledCommonProps } from "@mui/system";
import { blue, grey } from "../../constants/color";

export interface BaseInputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    MUIStyledCommonProps<Theme> {
  label?: string;
  required?: boolean;
  err?: string;
  endIcon?: React.ReactNode | JSX.Element;
}

export const BaseInput = forwardRef(
  (props: BaseInputProps, ref: LegacyRef<HTMLInputElement> | undefined) => {
    const { label, required, err, endIcon, ...otherProps } = props;
    return (
      <div style={{ width: "100%" }}>
        <label>
          <InputLabelText>{label}</InputLabelText>
          {label && required && (
            <span style={{ color: "red", marginLeft: 6 }}>*</span>
          )}
          <div style={{ position: "relative" }}>
            <StyledBaseInput err={Boolean(err)} {...otherProps} ref={ref} />
            {endIcon && <IconBox>{endIcon}</IconBox>}
          </div>
          {err && <InputErrorText>{err}</InputErrorText>}
        </label>
      </div>
    );
  }
);

export const InputLabelText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  display: "inline",
  fontSize: 14,
  marginBottom: 4,
  [theme.breakpoints.up("sm")]: {
    fontSize: 16,
  },
}));

const InputErrorText = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 13,
  marginTop: 4,
  marginLeft: 4,
  color: "red",
  [theme.breakpoints.up("sm")]: {
    fontSize: 15,
  },
}));

const StyledBaseInput = styled("input", {
  shouldForwardProp: (prop) => prop !== "err",
})<{ err?: boolean }>(({ theme, err }) => ({
  fontFamily: "Montserrat",
  padding: "8px 12px",
  width: "100%",
  minWidth: "100px",
  boxSizing: "border-box",
  fontSize: 14,
  borderRadius: 4,
  lineHeight: 1.25,
  border: `1px solid ${err ? "red" : grey}`,

  "&:focus": {
    borderColor: ` ${blue}`,
    boxShadow: `0 0 0 1px ${blue}`,
  },
  "&:focus-visible": {
    outline: "none",
    borderColor: blue["400"],
    boxShadow: `0 0 0 3px ${blue[200]}`,
  },
  "&:disabled": {
    backgroundColor: "#cccccc",
    color: "#1c2025bd",
  },

  [theme.breakpoints.up("sm")]: {
    padding: "6px 10px",
    fontSize: 16,
  },
  [theme.breakpoints.up("lg")]: {
    padding: "8px 12px",
    fontSize: 16,
    lineHeight: 1.25,
  },
}));


const IconBox = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  [theme.breakpoints.up("sm")]: {},
}));
import { LegacyRef, forwardRef, useState } from "react";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const PasswordInput = forwardRef(
  (props: BaseInputProps, ref: LegacyRef<HTMLInputElement> | undefined) => {
    const [showPW, setShowPW] = useState(false);

    return (
      <BaseInput
        type={showPW ? "text" : "password"}
        endIcon={
          <IconButton onClick={() => setShowPW(!showPW)}>
            {showPW ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        }
        {...props}
        // @ts-ignore
        ref={ref}
      />
    );
  }
);

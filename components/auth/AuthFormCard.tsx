import { forwardRef } from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

export type AuthFormCardProps = BoxProps<"form">;

export const AuthFormCard = forwardRef<HTMLFormElement, AuthFormCardProps>(function AuthFormCard(
  { children, sx, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 520,
        bgcolor: "background.paper",
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        boxShadow: { xs: "0 12px 25px rgba(0,0,0,0.08)", md: "0 20px 40px rgba(0,0,0,0.1)" },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
});
